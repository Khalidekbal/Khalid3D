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
    minWallThickness: number;
    maxDimX: number;
    maxDimY: number;
    maxDimZ: number;
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

function getWorker(): Worker {
  if (!workerInstance && typeof window !== "undefined") {
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
      console.error("Worker error:", err);
    };
  }
  if (!workerInstance) {
    throw new Error("Workers not supported in current environment.");
  }
  return workerInstance;
}

export async function analyzeMeshBuffer(
  buffer: ArrayBuffer,
  fileName: string,
  options: AnalysisOptions = {}
): Promise<MeshAnalysisResult> {
  if (typeof window === "undefined") {
    throw new Error("analyzeMeshBuffer can only run in browser client.");
  }

  // Clone buffer if needed so original buffer can still be used for Three.js rendering
  const bufferCopy = buffer.slice(0);

  return new Promise<MeshAnalysisResult>((resolve, reject) => {
    try {
      const worker = getWorker();
      const id = ++currentMessageId;

      const timer = setTimeout(() => {
        pendingPromises.delete(id);
        reject(new Error("Mesh analysis timed out after 30 seconds"));
      }, 30000);

      pendingPromises.set(id, { resolve, reject, timer });

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
      reject(err instanceof Error ? err : new Error(String(err)));
    }
  });
}
