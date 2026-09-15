"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import {
  RotateCcw,
  Eye,
  Grid,
  Maximize2,
  Box,
  Layers,
  Sparkles,
  Compass,
  AlertTriangle,
} from "lucide-react";

export interface ThreeViewerProps {
  modelUrl?: string;
  modelBuffer?: ArrayBuffer | null;
  fileName?: string;
  materialColor?: string;
  technologyName?: string;
  showDimensions?: boolean;
  dimX?: number;
  dimY?: number;
  dimZ?: number;
  unit?: string;
  className?: string;
}

export default function ThreeViewer({
  modelUrl,
  modelBuffer,
  fileName = "model.stl",
  materialColor = "#2563eb",
  technologyName = "FDM",
  showDimensions = true,
  dimX,
  dimY,
  dimZ,
  unit = "mm",
  className = "w-full h-full min-h-[400px]",
}: ThreeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renderMode, setRenderMode] = useState<"shaded" | "wireframe" | "xray" | "overhang">("shaded");
  const [showGrid, setShowGrid] = useState(true);
  const [showBoxCallouts, setShowBoxCallouts] = useState(showDimensions);

  // References for three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const currentMeshRef = useRef<THREE.Mesh | null>(null);
  const bboxHelperRef = useRef<THREE.BoxHelper | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Computed dimensions from geometry
  const [measuredDims, setMeasuredDims] = useState<{ x: number; y: number; z: number }>({
    x: dimX || 20,
    y: dimY || 20,
    z: dimZ || 20,
  });

  // 1. Initialize Scene, Camera, Lights, Renderer with Clean Light Studio Backdrop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    // Clean daylight studio backdrop
    scene.background = new THREE.Color(0xf8fafc);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(120, 120, 120);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxDistance = 1500;
    controls.minDistance = 5;
    controlsRef.current = controls;

    // Studio Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(120, 220, 160);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.8);
    fillLight.position.set(-150, 100, -100);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfef08a, 0.5);
    rimLight.position.set(0, -100, -100);
    scene.add(rimLight);

    // Build plate grid (300mm x 300mm industrial bed) in crisp light engineering tones
    const grid = new THREE.GridHelper(300, 30, 0x2563eb, 0xdbeafe);
    grid.position.y = 0;
    scene.add(grid);
    gridHelperRef.current = grid;

    // Mesh group container
    const meshGroup = new THREE.Group();
    scene.add(meshGroup);
    meshGroupRef.current = meshGroup;

    // Animation loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  // 2. Build Material based on Technology & Mode
  const getDisplayMaterial = useCallback(
    (tech: string, colorHex: string, mode: "shaded" | "wireframe" | "xray" | "overhang") => {
      const color = new THREE.Color(colorHex);

      if (mode === "wireframe") {
        return new THREE.MeshBasicMaterial({
          color: 0x2563eb,
          wireframe: true,
        });
      }

      if (mode === "xray") {
        return new THREE.MeshPhysicalMaterial({
          color: color,
          transmission: 0.85,
          opacity: 0.5,
          transparent: true,
          roughness: 0.1,
          ior: 1.45,
          thickness: 2.0,
          depthWrite: false,
        });
      }

      if (mode === "overhang") {
        // Vertex shader highlighting steep downward normals (>45 deg)
        return new THREE.ShaderMaterial({
          vertexShader: `
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            varying vec3 vNormal;
            void main() {
              float down = -vNormal.y;
              if (down > 0.707) {
                gl_FragColor = vec4(0.96, 0.62, 0.04, 1.0); // Amber warning
              } else if (down > 0.5) {
                gl_FragColor = vec4(0.93, 0.27, 0.27, 1.0); // Critical red
              } else {
                gl_FragColor = vec4(0.2, 0.5, 0.9, 1.0);
              }
            }
          `,
        });
      }

      // FDM Thermoplastic physical material
      return new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.45,
        metalness: 0.08,
      });
    },
    []
  );

  // 3. Load Geometry from Buffer or URL
  useEffect(() => {
    const meshGroup = meshGroupRef.current;
    const scene = sceneRef.current;
    if (!meshGroup || !scene) return;

    setLoading(true);
    setError(null);

    const loader = new STLLoader();

    const applyGeometry = (geometry: THREE.BufferGeometry) => {
      while (meshGroup.children.length > 0) {
        meshGroup.remove(meshGroup.children[0]);
      }
      if (bboxHelperRef.current) {
        scene.remove(bboxHelperRef.current);
        bboxHelperRef.current = null;
      }

      geometry.computeVertexNormals();
      geometry.center();

      geometry.computeBoundingBox();
      const bbox = geometry.boundingBox || new THREE.Box3();
      const size = new THREE.Vector3();
      bbox.getSize(size);

      const measured = {
        x: Number(size.x.toFixed(1)),
        y: Number(size.y.toFixed(1)),
        z: Number(size.z.toFixed(1)),
      };
      setMeasuredDims(measured);

      const mesh = new THREE.Mesh(
        geometry,
        getDisplayMaterial(technologyName, materialColor, renderMode)
      );
      mesh.position.y = size.y / 2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      meshGroup.add(mesh);
      currentMeshRef.current = mesh;

      // Bounding Box in royal blue
      const bboxHelper = new THREE.BoxHelper(mesh, 0x2563eb);
      scene.add(bboxHelper);
      bboxHelperRef.current = bboxHelper;

      const maxDim = Math.max(size.x, size.y, size.z, 10);
      const cam = cameraRef.current;
      const ctrl = controlsRef.current;
      if (cam && ctrl) {
        cam.position.set(maxDim * 1.6, maxDim * 1.4, maxDim * 1.6);
        cam.lookAt(0, size.y / 2, 0);
        ctrl.target.set(0, size.y / 2, 0);
        ctrl.update();
      }

      setLoading(false);
    };

    if (modelBuffer && modelBuffer.byteLength > 0) {
      try {
        const geometry = loader.parse(modelBuffer);
        applyGeometry(geometry);
      } catch (err) {
        console.error("Error parsing STL buffer:", err);
        setError("Could not parse 3D file geometry.");
        setLoading(false);
      }
    } else if (modelUrl) {
      loader.load(
        modelUrl,
        (geometry) => applyGeometry(geometry),
        undefined,
        (err) => {
          console.error("Failed to load model from URL:", err);
          setError("Failed to load 3D model.");
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, [modelBuffer, modelUrl, technologyName, materialColor, getDisplayMaterial]);

  // 4. Update Material on Mode or Color Change
  useEffect(() => {
    if (currentMeshRef.current) {
      currentMeshRef.current.material = getDisplayMaterial(
        technologyName,
        materialColor,
        renderMode
      );
    }
  }, [renderMode, technologyName, materialColor, getDisplayMaterial]);

  // 5. Toggle Helpers Visibility
  useEffect(() => {
    if (gridHelperRef.current) gridHelperRef.current.visible = showGrid;
    if (bboxHelperRef.current) bboxHelperRef.current.visible = showBoxCallouts;
  }, [showGrid, showBoxCallouts]);

  const handleLayFlat = () => {
    if (!currentMeshRef.current || !meshGroupRef.current) return;
    const mesh = currentMeshRef.current;
    mesh.rotation.x += Math.PI / 2;
    mesh.geometry.computeBoundingBox();
    const bbox = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    mesh.position.y = size.y / 2;
    if (bboxHelperRef.current) bboxHelperRef.current.update();
  };

  const handleAutoCenter = () => {
    if (!currentMeshRef.current || !controlsRef.current || !cameraRef.current) return;
    const mesh = currentMeshRef.current;
    mesh.rotation.set(0, 0, 0);
    const bbox = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    mesh.position.set(0, size.y / 2, 0);
    if (bboxHelperRef.current) bboxHelperRef.current.update();

    const maxDim = Math.max(size.x, size.y, size.z, 10);
    cameraRef.current.position.set(maxDim * 1.5, maxDim * 1.3, maxDim * 1.5);
    cameraRef.current.lookAt(0, size.y / 2, 0);
    controlsRef.current.target.set(0, size.y / 2, 0);
    controlsRef.current.update();
  };

  const setView = (view: "iso" | "top" | "front" | "side") => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    const dist = Math.max(measuredDims.x, measuredDims.y, measuredDims.z, 20) * 2;
    const targetY = measuredDims.y / 2;

    switch (view) {
      case "top":
        cam.position.set(0, dist * 1.5, 0.001);
        break;
      case "front":
        cam.position.set(0, targetY, dist);
        break;
      case "side":
        cam.position.set(dist, targetY, 0);
        break;
      case "iso":
      default:
        cam.position.set(dist * 0.8, dist * 0.7, dist * 0.8);
        break;
    }
    cam.lookAt(0, targetY, 0);
    ctrl.target.set(0, targetY, 0);
    ctrl.update();
  };

  return (
    <div className={`relative flex flex-col bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm ${className}`}>
      {/* Top Toolbar (White Glassmorphic) */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Model Name & Dimensions */}
        <div className="flex items-center gap-2 pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
          <Box className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-800 truncate max-w-[150px] md:max-w-[200px]">
            {fileName}
          </span>
          <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
            {measuredDims.x} × {measuredDims.y} × {measuredDims.z} {unit}
          </span>
        </div>

        {/* Right: Render Modes */}
        <div className="flex items-center gap-1 pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200 p-1 rounded-xl shadow-sm">
          <button
            onClick={() => setRenderMode("shaded")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              renderMode === "shaded"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
            title="Solid Shaded Material"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shaded</span>
          </button>
          <button
            onClick={() => setRenderMode("wireframe")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              renderMode === "wireframe"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
            title="Wireframe Mesh"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Wireframe</span>
          </button>
          <button
            onClick={() => setRenderMode("xray")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              renderMode === "xray"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
            title="X-Ray Internal View"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">X-Ray</span>
          </button>
          <button
            onClick={() => setRenderMode("overhang")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              renderMode === "overhang"
                ? "bg-amber-500 text-white shadow-xs"
                : "text-slate-600 hover:text-amber-600 hover:bg-amber-50"
            }`}
            title="Overhang Heatmap (>45°)"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">DFM Heatmap</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full flex-1 min-h-[360px] cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5 z-20">
          <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono font-semibold text-blue-600">
            Rendering 3D Model...
          </p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 text-center z-20">
          <AlertTriangle className="w-10 h-10 text-amber-500 mb-2" />
          <p className="text-sm font-bold text-slate-800">{error}</p>
          <p className="text-xs text-slate-500 mt-1">Please verify the STL file format.</p>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* View Angles Quick Selector */}
        <div className="flex items-center gap-1 pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200 p-1 rounded-xl shadow-sm">
          <span className="text-[10px] uppercase font-mono text-slate-400 px-1.5 flex items-center gap-1 font-bold">
            <Compass className="w-3 h-3 text-blue-600" /> View:
          </span>
          {(["iso", "top", "front", "side"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-2 py-0.5 text-xs text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-md font-semibold capitalize"
            >
              {v}
            </button>
          ))}
        </div>

        {/* CAD Tools: Lay Flat, Auto-Center, Grid Toggle */}
        <div className="flex items-center gap-1 pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200 p-1 rounded-xl shadow-sm">
          <button
            onClick={handleLayFlat}
            className="px-2.5 py-1 text-xs text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-semibold flex items-center gap-1 transition-colors"
            title="Lay Model Flat on Build Plate"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Lay Flat</span>
          </button>
          <button
            onClick={handleAutoCenter}
            className="px-2.5 py-1 text-xs text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-semibold flex items-center gap-1 transition-colors"
            title="Auto-Center in Chamber"
          >
            <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Center</span>
          </button>
          <button
            onClick={() => setShowGrid((prev) => !prev)}
            className={`p-1.5 rounded-lg transition-colors ${
              showGrid ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:text-slate-700"
            }`}
            title="Toggle Bed Grid"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowBoxCallouts((prev) => !prev)}
            className={`p-1.5 rounded-lg transition-colors ${
              showBoxCallouts ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:text-slate-700"
            }`}
            title="Toggle Bounding Box"
          >
            <Box className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
