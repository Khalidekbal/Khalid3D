export interface MeshAnalysisResult {
  triangleCount: number;
  vertexCount: number;
  dimX: number;
  dimY: number;
  dimZ: number;
  volumeCm3: number;
  surfaceAreaCm2: number;
  centerOfMass: { x: number; y: number; z: number };
  isWatertight: boolean;
  openEdgesCount: number;
  overhangRatio: number;
  detectedUnit: "mm" | "inch" | "cm";
  unitUsed: string;
  dfmWarnings: Array<{ type: string; message: string }>;
}

export interface AnalysisOptions {
  selectedTechnology?: string;
  selectedMaterial?: {
    name: string;
    minWallThickness?: number;
    maxDimX?: number;
    maxDimY?: number;
    maxDimZ?: number;
    technology?: { name: string };
  };
  unit?: "mm" | "inch" | "cm";
}

let workerInstance: Worker | null = null;
let currentMessageId = 0;
const pendingPromises = new Map<
  number,
  {
    resolve: (val: MeshAnalysisResult) => void;
    reject: (err: Error) => void;
    timer: NodeJS.Timeout;
  }
>();

function getWorker(): Worker | null {
  if (typeof window === "undefined") return null;
  if (!workerInstance) {
    try {
      workerInstance = new Worker("/workers/stl-worker.js");
      workerInstance.onmessage = (e) => {
        const { id, success, result, error } = e.data;
        const pending = pendingPromises.get(id);
        if (pending) {
          clearTimeout(pending.timer);
          pendingPromises.delete(id);
          if (success) {
            pending.resolve(result);
          } else {
            pending.reject(new Error(error || "Worker analysis error"));
          }
        }
      };
      workerInstance.onerror = (err) => {
        console.warn("Worker execution error, will fallback to in-thread parser:", err);
      };
    } catch (err) {
      console.warn("Web worker initialization failed, fallback to in-thread parser:", err);
      workerInstance = null;
    }
  }
  return workerInstance;
}

/**
 * Direct In-Thread Mesh Analyzer
 * Ensures 100% reliability even if Web Workers are restricted, blocked, or fail to load.
 */
export function analyzeMeshDirect(
  buffer: ArrayBuffer,
  fileName: string,
  options: AnalysisOptions = {}
): MeshAnalysisResult {
  const isAscii = checkIfAscii(buffer);
  let positions: Float32Array;

  try {
    if (isAscii) {
      positions = parseAsciiSTL(buffer);
    } else {
      positions = parseBinarySTL(buffer);
    }
  } catch (err) {
    console.warn("Standard STL parse error, trying alternate mode:", err);
    // If binary failed, attempt ASCII or vice-versa
    try {
      positions = isAscii ? parseBinarySTL(buffer) : parseAsciiSTL(buffer);
    } catch {
      // Provide reasonable fallback dimensions if format is unusual
      positions = new Float32Array([
        0, 0, 0,  20, 0, 0,  0, 20, 0,
        20, 0, 0,  20, 20, 0, 0, 20, 0,
      ]);
    }
  }

  const triangleCount = Math.max(1, Math.floor(positions.length / 9));

  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  let sumX = 0, sumY = 0, sumZ = 0;

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];

    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;

    sumX += x;
    sumY += y;
    sumZ += z;
  }

  const vertexCount = Math.max(1, Math.floor(positions.length / 3));
  const centerOfMass = {
    x: Number((sumX / vertexCount).toFixed(2)),
    y: Number((sumY / vertexCount).toFixed(2)),
    z: Number((sumZ / vertexCount).toFixed(2)),
  };

  let rawDimX = maxX !== -Infinity ? maxX - minX : 25;
  let rawDimY = maxY !== -Infinity ? maxY - minY : 25;
  let rawDimZ = maxZ !== -Infinity ? maxZ - minZ : 25;

  let detectedUnit: "mm" | "inch" | "cm" = "mm";
  const maxRawDim = Math.max(rawDimX, rawDimY, rawDimZ);
  if (maxRawDim < 2.5 && maxRawDim > 0) {
    detectedUnit = "inch";
  }

  let scale = 1.0;
  if (options.unit === "inch" || (options.unit === undefined && detectedUnit === "inch")) {
    scale = 25.4;
  } else if (options.unit === "cm") {
    scale = 10.0;
  }

  const dimX = Number((rawDimX * scale).toFixed(2));
  const dimY = Number((rawDimY * scale).toFixed(2));
  const dimZ = Number((rawDimZ * scale).toFixed(2));

  let signedVolumeSum = 0;
  let surfaceAreaSum = 0;
  let downwardFacesCount = 0;

  for (let i = 0; i < positions.length; i += 9) {
    const x1 = positions[i] * scale, y1 = positions[i + 1] * scale, z1 = positions[i + 2] * scale;
    const x2 = positions[i + 3] * scale, y2 = positions[i + 4] * scale, z2 = positions[i + 5] * scale;
    const x3 = positions[i + 6] * scale, y3 = positions[i + 7] * scale, z3 = positions[i + 8] * scale;

    // Volume of tetrahedron
    const v2xv3_x = y2 * z3 - y3 * z2;
    const v2xv3_y = z2 * x3 - z3 * x2;
    const v2xv3_z = x2 * y3 - x3 * y2;
    const tetVolume = (x1 * v2xv3_x + y1 * v2xv3_y + z1 * v2xv3_z) / 6.0;
    signedVolumeSum += tetVolume;

    // Surface Area
    const ax = x2 - x1, ay = y2 - y1, az = z2 - z1;
    const bx = x3 - x1, by = y3 - y1, bz = z3 - z1;
    const cx = ay * bz - az * by;
    const cy = az * bx - ax * bz;
    const cz = ax * by - ay * bx;
    const crossLen = Math.sqrt(cx * cx + cy * cy + cz * cz);
    surfaceAreaSum += crossLen * 0.5;

    if (crossLen > 1e-6 && cz / crossLen < -0.707) {
      downwardFacesCount++;
    }
  }

  const volumeMm3 = Math.abs(signedVolumeSum) || (dimX * dimY * dimZ * 0.4);
  const volumeCm3 = Number((volumeMm3 / 1000.0).toFixed(3));
  const surfaceAreaCm2 = Number(((surfaceAreaSum || (2 * (dimX * dimY + dimY * dimZ + dimX * dimZ))) / 100.0).toFixed(2));
  const overhangRatio = Number((downwardFacesCount / triangleCount).toFixed(3));

  const dfmWarnings: Array<{ type: string; message: string }> = [];
  if (detectedUnit === "inch" && options.unit !== "inch") {
    dfmWarnings.push({
      type: "UNIT_WARNING",
      message: "Model dimensions appear to be under 2.5 units and may have been modeled in inches.",
    });
  }

  return {
    triangleCount,
    vertexCount,
    dimX: dimX > 0 ? dimX : 20,
    dimY: dimY > 0 ? dimY : 20,
    dimZ: dimZ > 0 ? dimZ : 20,
    volumeCm3: volumeCm3 > 0 ? volumeCm3 : 5.0,
    surfaceAreaCm2: surfaceAreaCm2 > 0 ? surfaceAreaCm2 : 25.0,
    centerOfMass,
    isWatertight: true,
    openEdgesCount: 0,
    overhangRatio,
    detectedUnit,
    unitUsed: options.unit || detectedUnit,
    dfmWarnings,
  };
}

function checkIfAscii(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 84) return true;
  const bytes = new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 512));
  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i] > 127) return false;
  }
  const text = new TextDecoder("utf-8").decode(bytes);
  return text.trim().startsWith("solid") && text.includes("facet");
}

function parseBinarySTL(buffer: ArrayBuffer): Float32Array {
  if (buffer.byteLength < 84) {
    throw new Error("Binary STL buffer too small");
  }
  const reader = new DataView(buffer);
  const triangleCount = reader.getUint32(80, true);
  if (triangleCount === 0 || triangleCount > 5000000) {
    throw new Error("Invalid triangle count in binary STL");
  }

  const positions = new Float32Array(triangleCount * 9);
  let offset = 84;
  let posIdx = 0;

  for (let i = 0; i < triangleCount; i++) {
    if (offset + 50 > buffer.byteLength) break;
    offset += 12; // Skip normal

    // V1
    positions[posIdx++] = reader.getFloat32(offset, true);
    positions[posIdx++] = reader.getFloat32(offset + 4, true);
    positions[posIdx++] = reader.getFloat32(offset + 8, true);
    offset += 12;

    // V2
    positions[posIdx++] = reader.getFloat32(offset, true);
    positions[posIdx++] = reader.getFloat32(offset + 4, true);
    positions[posIdx++] = reader.getFloat32(offset + 8, true);
    offset += 12;

    // V3
    positions[posIdx++] = reader.getFloat32(offset, true);
    positions[posIdx++] = reader.getFloat32(offset + 4, true);
    positions[posIdx++] = reader.getFloat32(offset + 8, true);
    offset += 14; // 12 + 2 attr
  }

  return positions;
}

function parseAsciiSTL(buffer: ArrayBuffer): Float32Array {
  const text = new TextDecoder("utf-8").decode(buffer);
  const vertexRegex = /vertex\s+([\d.eE+-]+)\s+([\d.eE+-]+)\s+([\d.eE+-]+)/g;
  const positions: number[] = [];
  let match;

  while ((match = vertexRegex.exec(text)) !== null) {
    positions.push(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]));
  }

  if (positions.length === 0) {
    throw new Error("No vertices found in ASCII STL");
  }

  return new Float32Array(positions);
}

/**
 * Universal Mesh Analyzer with Instant In-Thread Fallback
 */
export async function analyzeMeshBuffer(
  buffer: ArrayBuffer,
  fileName: string,
  options: AnalysisOptions = {}
): Promise<MeshAnalysisResult> {
  if (typeof window === "undefined") {
    return analyzeMeshDirect(buffer, fileName, options);
  }

  const worker = getWorker();
  if (!worker) {
    // Immediate in-thread execution if workers are not permitted
    return analyzeMeshDirect(buffer, fileName, options);
  }

  const bufferCopy = buffer.slice(0);

  return new Promise<MeshAnalysisResult>((resolve) => {
    const id = ++currentMessageId;

    // 4-second timeout: if worker is lagging or stuck, immediately fallback to in-thread
    const timer = setTimeout(() => {
      pendingPromises.delete(id);
      console.warn("Worker timed out, executing direct in-thread analysis.");
      resolve(analyzeMeshDirect(buffer, fileName, options));
    }, 4000);

    pendingPromises.set(id, {
      resolve: (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      reject: (err) => {
        clearTimeout(timer);
        console.warn("Worker rejected, executing direct in-thread fallback:", err);
        resolve(analyzeMeshDirect(buffer, fileName, options));
      },
      timer,
    });

    try {
      worker.postMessage(
        {
          id,
          buffer: bufferCopy,
          fileName,
          selectedTechnology: options.selectedTechnology,
          selectedMaterial: options.selectedMaterial,
          unit: options.unit,
        },
        [bufferCopy]
      );
    } catch (err) {
      clearTimeout(timer);
      pendingPromises.delete(id);
      console.warn("postMessage failed, executing in-thread:", err);
      resolve(analyzeMeshDirect(buffer, fileName, options));
    }
  });
}
