import * as THREE from 'three';

export interface ElevationStats {
  minElevation: number;
  maxElevation: number;
  meanElevation: number;
  unit: string;
  isIllustrative: boolean;
  classification: string;
}

/**
 * Simplex-like noise helper for smooth multi-frequency terrain generation
 */
function pseudoNoise(x: number, y: number, seed: number = 42): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453123;
  return n - Math.floor(n);
}

function smoothNoise(x: number, y: number, seed: number): number {
  const i = Math.floor(x);
  const j = Math.floor(y);
  const fx = x - i;
  const fy = y - j;

  // Smooth interpolation curves
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);

  const n00 = pseudoNoise(i, j, seed);
  const n10 = pseudoNoise(i + 1, j, seed);
  const n01 = pseudoNoise(i, j + 1, seed);
  const n11 = pseudoNoise(i + 1, j + 1, seed);

  const nx0 = n00 * (1 - u) + n10 * u;
  const nx1 = n01 * (1 - u) + n11 * u;

  return nx0 * (1 - v) + nx1 * v;
}

/**
 * Multi-octave Fractional Brownian Motion for geomorphological terrain simulation
 */
function fbm(x: number, y: number, octaves: number = 4, seed: number = 1): number {
  let val = 0;
  let amp = 0.5;
  let freq = 1.0;
  for (let o = 0; o < octaves; o++) {
    val += amp * smoothNoise(x * freq, y * freq, seed + o * 100);
    freq *= 2.05;
    amp *= 0.48;
  }
  return val;
}

/**
 * Scientific USGS/NASA Elevation Colormap (Turbo/Spectral ramp)
 */
function getScientificElevationColor(normalized: number): THREE.Color {
  const t = Math.max(0, Math.min(1, normalized));
  if (t < 0.2) {
    // Deep indigo to cyan
    return new THREE.Color().setRGB(0.1 + t * 0.5, 0.2 + t * 3.5, 0.7 + t * 1.5);
  } else if (t < 0.45) {
    // Cyan to emerald
    const sub = (t - 0.2) / 0.25;
    return new THREE.Color().setRGB(0.2 * (1 - sub) + 0.1 * sub, 0.9 * (1 - sub) + 0.8 * sub, 1.0 * (1 - sub) + 0.3 * sub);
  } else if (t < 0.7) {
    // Green to yellow-orange
    const sub = (t - 0.45) / 0.25;
    return new THREE.Color().setRGB(0.1 + sub * 0.8, 0.8 - sub * 0.1, 0.1);
  } else if (t < 0.9) {
    // Orange to red
    const sub = (t - 0.7) / 0.2;
    return new THREE.Color().setRGB(0.9 + sub * 0.1, 0.7 - sub * 0.5, 0.1);
  } else {
    // High peaks: white-snow
    const sub = (t - 0.9) / 0.1;
    return new THREE.Color().setRGB(1.0, 0.3 + sub * 0.7, 0.3 + sub * 0.7);
  }
}

/**
 * Natural Surface Colormaps per Planetary Body
 */
function getNaturalPlanetaryColor(planet: string, normalized: number): THREE.Color {
  const p = planet.toLowerCase();
  const t = Math.max(0, Math.min(1, normalized));

  if (p === 'moon') {
    // Lunar mare to anorthositic highlands
    const v = 0.15 + t * 0.65;
    return new THREE.Color(v, v, v + 0.02);
  }

  if (p === 'mars') {
    // Ferric oxide basalt to amber dust crests
    const r = 0.45 + t * 0.45;
    const g = 0.18 + t * 0.32;
    const b = 0.10 + t * 0.18;
    return new THREE.Color(r, g, b);
  }

  // Earth default: Vegetated valley -> Rocky slope -> Granite peak
  if (t < 0.35) {
    const sub = t / 0.35;
    return new THREE.Color(0.12 + sub * 0.18, 0.28 + sub * 0.14, 0.16 + sub * 0.08);
  } else if (t < 0.75) {
    const sub = (t - 0.35) / 0.4;
    return new THREE.Color(0.38 + sub * 0.24, 0.34 + sub * 0.22, 0.26 + sub * 0.22);
  } else {
    const sub = (t - 0.75) / 0.25;
    return new THREE.Color(0.68 + sub * 0.28, 0.66 + sub * 0.30, 0.64 + sub * 0.34);
  }
}

/**
 * Elevation statistics for regions
 */
export function getElevationStats(planet: string): ElevationStats {
  const p = planet.toLowerCase();
  if (p === 'moon') {
    return {
      minElevation: -4120,
      maxElevation: 1840,
      meanElevation: -1140,
      unit: 'm',
      isIllustrative: true,
      classification: 'Lunar Polar Complex Impact Basin',
    };
  }
  if (p === 'mars') {
    return {
      minElevation: -2640,
      maxElevation: 1920,
      meanElevation: -360,
      unit: 'm',
      isIllustrative: true,
      classification: 'Martian Volcanic Rift & Basaltic Floor',
    };
  }
  return {
    minElevation: 840,
    maxElevation: 3260,
    meanElevation: 1980,
    unit: 'm',
    isIllustrative: true,
    classification: 'Terrestrial Mountain Ridge & Basin Analogue',
  };
}

/**
 * Generates an optimized, morphologically accurate 3D terrain geometry
 */
export function generateTerrainGeometry(
  planet: string,
  regionId: string,
  resolution: number = 64,
  exaggeration: number = 1.0,
  elevationColormap: boolean = false
): { geometry: THREE.BufferGeometry; stats: ElevationStats } {
  const stats = getElevationStats(planet);
  const size = 10;
  const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution);

  // Rotate plane so Y is up
  geometry.rotateX(-Math.PI / 2);

  const posAttr = geometry.attributes.position;
  const vertexCount = posAttr.count;
  const colors = new Float32Array(vertexCount * 3);

  // Generate deterministic seed from regionId string
  let seed = 42;
  for (let i = 0; i < regionId.length; i++) {
    seed = (seed * 31 + regionId.charCodeAt(i)) & 0xffff;
  }

  const p = planet.toLowerCase();

  // First pass: compute height displacement
  for (let i = 0; i < vertexCount; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);

    // Normalized coordinates [-1, 1]
    const nx = x / (size / 2);
    const nz = z / (size / 2);
    const distFromCenter = Math.sqrt(nx * nx + nz * nz);

    let h = 0;

    if (p === 'moon') {
      // Impact crater basin: central peak, deep rim cavity, terraced ejecta
      const craterRadius = 0.65;
      const rimWidth = 0.22;
      const d = Math.abs(distFromCenter - craterRadius);

      // Deep bowl
      const bowl = Math.max(0, 1 - (distFromCenter / craterRadius) ** 2);
      // Crater rim wall
      const rim = Math.exp(-((d / rimWidth) ** 2)) * 0.75;
      // Central uplift peak
      const centralPeak = Math.exp(-((distFromCenter / 0.18) ** 2)) * 0.45;
      // Background regolith micro-texture
      const noise = fbm(x * 0.8, z * 0.8, 4, seed) * 0.25;

      h = -bowl * 1.6 + rim + centralPeak + noise;
    } else if (p === 'mars') {
      // Martian rift canyon / volcanic ridge
      const canyon = Math.exp(-((Math.abs(nz + Math.sin(nx * 1.8) * 0.3) / 0.35) ** 2)) * 1.5;
      const mesas = Math.floor(fbm(x * 0.5, z * 0.5, 3, seed) * 4) * 0.28;
      const noise = fbm(x * 1.2, z * 1.2, 4, seed + 10) * 0.35;

      h = -canyon + mesas + noise;
    } else {
      // Earth: Tectonic mountain ridge, fault valleys, alluvial terrain
      const ridge = Math.abs(fbm(x * 0.6, z * 0.6, 5, seed) * 2 - 1) * 1.8;
      const foothills = fbm(x * 1.4, z * 1.4, 3, seed + 50) * 0.4;
      const valley = Math.sin(nx * 2.5) * 0.3;

      h = ridge + foothills + valley;
    }

    // Apply vertical exaggeration
    const yDisplacement = h * 0.85 * exaggeration;
    posAttr.setY(i, yDisplacement);
  }

  // Recompute normals for accurate scientific directional lighting
  geometry.computeVertexNormals();

  // Find min and max Y for normalized colormapping
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < vertexCount; i++) {
    const y = posAttr.getY(i);
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const rangeY = maxY - minY || 1;

  // Second pass: compute vertex colors
  for (let i = 0; i < vertexCount; i++) {
    const y = posAttr.getY(i);
    const normalized = (y - minY) / rangeY;

    const color = elevationColormap
      ? getScientificElevationColor(normalized)
      : getNaturalPlanetaryColor(planet, normalized);

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  return { geometry, stats };
}
