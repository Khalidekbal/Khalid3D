import fs from "fs";
import path from "path";

function createCubeSTL(sizeX = 20, sizeY = 20, sizeZ = 20): Buffer {
  const hx = sizeX / 2;
  const hy = sizeY / 2;
  const hz = sizeZ / 2;

  // 8 vertices of cube centered at origin, then shifted so base sits on Z=0
  const v = [
    [-hx, -hy, 0],     // 0
    [hx, -hy, 0],      // 1
    [hx, hy, 0],       // 2
    [-hx, hy, 0],      // 3
    [-hx, -hy, sizeZ], // 4
    [hx, -hy, sizeZ],  // 5
    [hx, hy, sizeZ],   // 6
    [-hx, hy, sizeZ],  // 7
  ];

  // 12 triangles (2 per face)
  const faces = [
    // Bottom (z=0, normal pointing down)
    [0, 2, 1], [0, 3, 2],
    // Top (z=sizeZ, normal pointing up)
    [4, 5, 6], [4, 6, 7],
    // Front (-hy)
    [0, 1, 5], [0, 5, 4],
    // Right (hx)
    [1, 2, 6], [1, 6, 5],
    // Back (hy)
    [2, 3, 7], [2, 7, 6],
    // Left (-hx)
    [3, 0, 4], [3, 4, 7],
  ];

  const buffer = Buffer.alloc(84 + faces.length * 50);
  buffer.write("JLC3DP Calibration Part Binary STL Export", 0, 80, "ascii");
  buffer.writeUInt32LE(faces.length, 80);

  let offset = 84;
  for (const [i1, i2, i3] of faces) {
    const v1 = v[i1];
    const v2 = v[i2];
    const v3 = v[i3];

    // Compute normal
    const ax = v2[0] - v1[0], ay = v2[1] - v1[1], az = v2[2] - v1[2];
    const bx = v3[0] - v1[0], by = v3[1] - v1[1], bz = v3[2] - v1[2];
    let nx = ay * bz - az * by;
    let ny = az * bx - ax * bz;
    let nz = ax * by - ay * bx;
    const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    nx /= len; ny /= len; nz /= len;

    // Normal
    buffer.writeFloatLE(nx, offset);
    buffer.writeFloatLE(ny, offset + 4);
    buffer.writeFloatLE(nz, offset + 8);
    offset += 12;

    // Vertex 1
    buffer.writeFloatLE(v1[0], offset);
    buffer.writeFloatLE(v1[1], offset + 4);
    buffer.writeFloatLE(v1[2], offset + 8);
    offset += 12;

    // Vertex 2
    buffer.writeFloatLE(v2[0], offset);
    buffer.writeFloatLE(v2[1], offset + 4);
    buffer.writeFloatLE(v2[2], offset + 8);
    offset += 12;

    // Vertex 3
    buffer.writeFloatLE(v3[0], offset);
    buffer.writeFloatLE(v3[1], offset + 4);
    buffer.writeFloatLE(v3[2], offset + 8);
    offset += 12;

    // Attribute byte count
    buffer.writeUInt16LE(0, offset);
    offset += 2;
  }

  return buffer;
}

function createSteppedBracketSTL(): Buffer {
  // L-shaped industrial bracket
  const v = [
    // Base block
    [-40, -15, 0],  [40, -15, 0],  [40, 15, 0],  [-40, 15, 0],
    [-40, -15, 10], [40, -15, 10], [40, 15, 10], [-40, 15, 10],
    // Upright post
    [-40, -15, 45], [-15, -15, 45], [-15, 15, 45], [-40, 15, 45],
  ];

  // Triangles for bracket
  const faces = [
    // Base bottom
    [0, 2, 1], [0, 3, 2],
    // Base front (-15)
    [0, 1, 5], [0, 5, 4],
    // Base right (40)
    [1, 2, 6], [1, 6, 5],
    // Base back (15)
    [2, 3, 7], [2, 7, 6],
    // Base top ledge (from x=-15 to 40)
    [5, 6, 7], [5, 7, 4], // (simplified)
    // Upright top
    [8, 9, 10], [8, 10, 11],
    // Upright front
    [4, 9, 8], [4, 5, 9],
    // Upright left
    [0, 4, 8], [0, 8, 11],
    // Upright back
    [7, 11, 10], [7, 10, 6],
  ];

  const buffer = Buffer.alloc(84 + faces.length * 50);
  buffer.write("JLC3DP Drone Motor Arm STL", 0, 80, "ascii");
  buffer.writeUInt32LE(faces.length, 80);

  let offset = 84;
  for (const [i1, i2, i3] of faces) {
    const v1 = v[i1 % v.length];
    const v2 = v[i2 % v.length];
    const v3 = v[i3 % v.length];

    const ax = v2[0] - v1[0], ay = v2[1] - v1[1], az = v2[2] - v1[2];
    const bx = v3[0] - v1[0], by = v3[1] - v1[1], bz = v3[2] - v1[2];
    let nx = ay * bz - az * by;
    let ny = az * bx - ax * bz;
    let nz = ax * by - ay * bx;
    const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;

    buffer.writeFloatLE(nx / len, offset);
    buffer.writeFloatLE(ny / len, offset + 4);
    buffer.writeFloatLE(nz / len, offset + 8);
    offset += 12;

    buffer.writeFloatLE(v1[0], offset);
    buffer.writeFloatLE(v1[1], offset + 4);
    buffer.writeFloatLE(v1[2], offset + 8);
    offset += 12;

    buffer.writeFloatLE(v2[0], offset);
    buffer.writeFloatLE(v2[1], offset + 4);
    buffer.writeFloatLE(v2[2], offset + 8);
    offset += 12;

    buffer.writeFloatLE(v3[0], offset);
    buffer.writeFloatLE(v3[1], offset + 4);
    buffer.writeFloatLE(v3[2], offset + 8);
    offset += 12;

    buffer.writeUInt16LE(0, offset);
    offset += 2;
  }

  return buffer;
}

const dir = path.join(process.cwd(), "public", "models");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, "calibration_cube_20mm.stl"), createCubeSTL(20, 20, 20));
fs.writeFileSync(path.join(dir, "sensor_enclosure_lid.stl"), createCubeSTL(65, 45, 14));
fs.writeFileSync(path.join(dir, "drone_motor_bracket.stl"), createSteppedBracketSTL());

console.log("✓ Successfully generated sample STL models in /public/models/");
