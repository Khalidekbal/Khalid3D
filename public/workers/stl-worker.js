/**
 * 3D Mesh Analysis Web Worker for JLC3DP Platform
 * Performs client-side binary & ASCII STL parsing, signed tetrahedron volume,
 * surface area, AABB bounding box, watertight/manifold verification, and DFM rule checks.
 */

self.onmessage = function (e) {
  const { id, buffer, fileName, selectedTechnology, selectedMaterial, unit = "mm" } = e.data;

  try {
    const result = analyzeMesh(buffer, fileName, {
      selectedTechnology,
      selectedMaterial,
      unit,
    });
    self.postMessage({ id, success: true, result });
  } catch (err) {
    self.postMessage({ id, success: false, error: err.message || "Failed to analyze 3D file" });
  }
};

function analyzeMesh(arrayBuffer, fileName, options = {}) {
  const isAscii = checkIfAscii(arrayBuffer);
  let positions;

  if (isAscii) {
    positions = parseAsciiSTL(arrayBuffer);
  } else {
    positions = parseBinarySTL(arrayBuffer);
  }

  const triangleCount = positions.length / 9;
  if (triangleCount === 0) {
    throw new Error("File contains 0 triangles or is empty.");
  }

  // 1. Calculate Bounding Box & Center of Mass
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

  const vertexCount = positions.length / 3;
  const centerOfMass = {
    x: sumX / vertexCount,
    y: sumY / vertexCount,
    z: sumZ / vertexCount,
  };

  let rawDimX = maxX - minX;
  let rawDimY = maxY - minY;
  let rawDimZ = maxZ - minZ;

  // 2. Unit Ambiguity Detection (Inch vs mm vs cm)
  let detectedUnit = "mm";
  let unitWarning = null;

  const maxRawDim = Math.max(rawDimX, rawDimY, rawDimZ);
  if (maxRawDim < 2.5 && maxRawDim > 0) {
    detectedUnit = "inch";
    unitWarning = "Model dimensions are under 2.5 units. It was likely modeled in inches. We recommend converting to millimeters.";
  } else if (maxRawDim > 1000) {
    unitWarning = `Model dimension (${maxRawDim.toFixed(1)}mm) exceeds 1 meter. Please verify if exported in centimeters or meters.`;
  }

  // Unit conversion scale factor relative to millimeters
  let scale = 1.0;
  if (options.unit === "inch" || (options.unit === undefined && detectedUnit === "inch")) {
    scale = 25.4;
  } else if (options.unit === "cm") {
    scale = 10.0;
  }

  const dimX = rawDimX * scale;
  const dimY = rawDimY * scale;
  const dimZ = rawDimZ * scale;

  // 3. Signed Tetrahedron Volume Calculation:
  // V = 1/6 * sum(v1 . (v2 x v3))
  let signedVolumeSum = 0;
  let surfaceAreaSum = 0;
  let downwardFacesCount = 0;

  // Edge tracking for watertight / manifold check
  // Quantize vertex coordinates to 4 decimal places to match close vertices
  const edgeMap = new Map();

  for (let i = 0; i < positions.length; i += 9) {
    // Triangle vertices (scaled to mm)
    const x1 = positions[i] * scale;
    const y1 = positions[i + 1] * scale;
    const z1 = positions[i + 2] * scale;

    const x2 = positions[i + 3] * scale;
    const y2 = positions[i + 4] * scale;
    const z2 = positions[i + 5] * scale;

    const x3 = positions[i + 6] * scale;
    const y3 = positions[i + 7] * scale;
    const z3 = positions[i + 8] * scale;

    // Scalar triple product: v1 . (v2 x v3)
    const v2xv3_x = y2 * z3 - y3 * z2;
    const v2xv3_y = z2 * x3 - z3 * x2;
    const v2xv3_z = x2 * y3 - x3 * y2;
    const tetVolume = (x1 * v2xv3_x + y1 * v2xv3_y + z1 * v2xv3_z) / 6.0;
    signedVolumeSum += tetVolume;

    // Cross product (v2 - v1) x (v3 - v1) for surface area and normal vector
    const ax = x2 - x1, ay = y2 - y1, az = z2 - z1;
    const bx = x3 - x1, by = y3 - y1, bz = z3 - z1;
    const cx = ay * bz - az * by;
    const cy = az * bx - ax * bz;
    const cz = ax * by - ay * bx;
    const crossLen = Math.sqrt(cx * cx + cy * cy + cz * cz);
    surfaceAreaSum += crossLen * 0.5;

    // Normal vector direction: check if overhang angle exceeds 45 degrees downward
    if (crossLen > 1e-6) {
      const normalZ = cz / crossLen;
      // Normal pointing downwards past 45 deg (normalZ < -0.707)
      if (normalZ < -0.707) {
        downwardFacesCount++;
      }
    }

    // Edge hash calculation for manifold validation
    addEdge(edgeMap, x1, y1, z1, x2, y2, z2);
    addEdge(edgeMap, x2, y2, z2, x3, y3, z3);
    addEdge(edgeMap, x3, y3, z3, x1, y1, z1);
  }

  // Convert mm^3 to cm^3 (1 cm^3 = 1000 mm^3)
  const volumeMm3 = Math.abs(signedVolumeSum);
  const volumeCm3 = volumeMm3 / 1000.0;

  // Convert mm^2 to cm^2 (1 cm^2 = 100 mm^2)
  const surfaceAreaCm2 = surfaceAreaSum / 100.0;

  // 4. Watertight & Manifold Verification
  let openEdgesCount = 0;
  for (const count of edgeMap.values()) {
    if (count !== 2) {
      openEdgesCount++;
    }
  }
  const isWatertight = openEdgesCount === 0;

  // 5. Overhang support ratio
  const overhangRatio = triangleCount > 0 ? downwardFacesCount / triangleCount : 0;

  // 6. DFM Rule Violations
  const dfmWarnings = [];
  if (unitWarning) {
    dfmWarnings.push({ type: "UNIT_WARNING", message: unitWarning });
  }

  if (!isWatertight) {
    dfmWarnings.push({
      type: "NON_WATERTIGHT",
      message: `Mesh has ${openEdgesCount} open or non-manifold edge boundaries. Geometry may need auto-repair before printing.`,
    });
  }

  // Build envelope constraint check
  if (options.selectedMaterial) {
    const mat = options.selectedMaterial;
    if (dimX > mat.maxDimX || dimY > mat.maxDimY || dimZ > mat.maxDimZ) {
      dfmWarnings.push({
        type: "BUILD_VOLUME_EXCEEDED",
        message: `Dimensions (${dimX.toFixed(1)} × ${dimY.toFixed(1)} × ${dimZ.toFixed(1)} mm) exceed maximum build chamber (${mat.maxDimX} × ${mat.maxDimY} × ${mat.maxDimZ} mm) for ${mat.name}.`,
      });
    }

    // Thin wall warning
    // Estimated characteristic thickness = 2 * Volume / SurfaceArea
    const characteristicThicknessMm = surfaceAreaSum > 0 ? (2 * volumeMm3) / surfaceAreaSum : 1.0;
    if (characteristicThicknessMm < mat.minWallThickness) {
      dfmWarnings.push({
        type: "THIN_WALL",
        message: `Estimated wall thickness (~${characteristicThicknessMm.toFixed(2)}mm) is near or below the recommended minimum (${mat.minWallThickness}mm). Thin features may warp or break.`,
      });
    }

    // Resin drainage warning for SLA
    if ((options.selectedTechnology === "SLA" || mat.technology?.name === "SLA") && volumeCm3 > 60.0) {
      dfmWarnings.push({
        type: "RESIN_DRAINAGE",
        message: `Large solid volume (${volumeCm3.toFixed(1)} cm³) detected. Ensure model is hollowed with drain holes to prevent suction forces and trapped liquid resin.`,
      });
    }
  }

  return {
    triangleCount,
    vertexCount,
    dimX: Number(dimX.toFixed(2)),
    dimY: Number(dimY.toFixed(2)),
    dimZ: Number(dimZ.toFixed(2)),
    volumeCm3: Number(volumeCm3.toFixed(3)),
    surfaceAreaCm2: Number(surfaceAreaCm2.toFixed(2)),
    centerOfMass,
    isWatertight,
    openEdgesCount,
    overhangRatio: Number(overhangRatio.toFixed(3)),
    detectedUnit,
    unitUsed: options.unit || detectedUnit,
    dfmWarnings,
  };
}

function addEdge(edgeMap, x1, y1, z1, x2, y2, z2) {
  const p1 = `${Math.round(x1 * 100)},${Math.round(y1 * 100)},${Math.round(z1 * 100)}`;
  const p2 = `${Math.round(x2 * 100)},${Math.round(y2 * 100)},${Math.round(z2 * 100)}`;
  const key = p1 < p2 ? `${p1}_${p2}` : `${p2}_${p1}`;
  edgeMap.set(key, (edgeMap.get(key) || 0) + 1);
}

function checkIfAscii(buffer) {
  const bytes = new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 512));
  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i] > 127) return false;
  }
  const text = new TextDecoder("utf-8").decode(bytes);
  return text.trim().startsWith("solid") && text.includes("facet");
}

function parseBinarySTL(buffer) {
  const reader = new DataView(buffer);
  const triangleCount = reader.getUint32(80, true);
  const positions = new Float32Array(triangleCount * 9);

  let offset = 84;
  let posIdx = 0;

  for (let i = 0; i < triangleCount; i++) {
    // Skip normal (12 bytes)
    offset += 12;

    // Vertex 1
    positions[posIdx++] = reader.getFloat32(offset, true);
    positions[posIdx++] = reader.getFloat32(offset + 4, true);
    positions[posIdx++] = reader.getFloat32(offset + 8, true);
    offset += 12;

    // Vertex 2
    positions[posIdx++] = reader.getFloat32(offset, true);
    positions[posIdx++] = reader.getFloat32(offset + 4, true);
    positions[posIdx++] = reader.getFloat32(offset + 8, true);
    offset += 12;

    // Vertex 3
    positions[posIdx++] = reader.getFloat32(offset, true);
    positions[posIdx++] = reader.getFloat32(offset + 4, true);
    positions[posIdx++] = reader.getFloat32(offset + 8, true);
    offset += 12;

    // Skip attribute byte count (2 bytes)
    offset += 2;
  }

  return positions;
}

function parseAsciiSTL(buffer) {
  const text = new TextDecoder("utf-8").decode(buffer);
  const vertexRegex = /vertex\s+([\d.eE+-]+)\s+([\d.eE+-]+)\s+([\d.eE+-]+)/g;
  const positions = [];
  let match;

  while ((match = vertexRegex.exec(text)) !== null) {
    positions.push(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]));
  }

  return new Float32Array(positions);
}
