export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

export function heartPoints(count = 600) {
  const pts: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    pts.push([x, -y]); // <-- flipped vertically
  }
  // normalize to 0..1 range
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  return pts.map(([x, y]) => [(x - minX) / (maxX - minX), (y - minY) / (maxY - minY)]);
}

export function ringPoints(count = 600) {
  const pts: [number, number][] = [];
  const r = 0.45;
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    pts.push([0.5 + r * Math.cos(t), 0.5 + r * Math.sin(t)]);
  }
  return pts;
}

export function bunnyOutline(count = 600) {
  const pts: [number, number][] = [];
  const earR = 0.12, earCx1 = 0.38, earCx2 = 0.62, earCy = 0.22;
  for (let i = 0; i < count * 0.3; i++) {
    const t = (i / (count * 0.3)) * Math.PI * 2;
    pts.push([earCx1 + earR * Math.cos(t), earCy + 1.5 * earR * Math.sin(t)]);
  }
  for (let i = 0; i < count * 0.3; i++) {
    const t = (i / (count * 0.3)) * Math.PI * 2;
    pts.push([earCx2 + earR * Math.cos(t), earCy + 1.5 * earR * Math.sin(t)]);
  }
  const faceR = 0.28, faceCx = 0.5, faceCy = 0.58;
  for (let i = 0; i < count * 0.4; i++) {
    const a = Math.PI * 0.1 + (i / (count * 0.4)) * Math.PI * 1.8;
    pts.push([faceCx + faceR * Math.cos(a), faceCy + faceR * Math.sin(a)]);
  }
  return pts;
}

export function lerpPoints(a: [number, number][], b: [number, number][], t: number) {
  const len = Math.min(a.length, b.length);
  const out = new Array(len);
  for (let i = 0; i < len; i++) {
    out[i] = [a[i][0] + (b[i][0] - a[i][0]) * t, a[i][1] + (b[i][1] - a[i][1]) * t] as [number, number];
  }
  return out as [number, number][];
}

