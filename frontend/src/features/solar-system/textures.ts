import * as THREE from 'three';

// Cache generated textures so they are created once per session
const textureCache: Record<string, THREE.CanvasTexture> = {};

/**
 * Procedural Sun texture with subtle solar granulation and corona glow
 */
export function getSunTexture(): THREE.CanvasTexture {
  if (textureCache.sun) return textureCache.sun;

  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Base glowing yellow-orange gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#ff7700');
  grad.addColorStop(0.3, '#ffaa00');
  grad.addColorStop(0.6, '#ffd23f');
  grad.addColorStop(1, '#ff8800');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Solar flares and surface granulation spots
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 8 + 2;
    const alpha = Math.random() * 0.4 + 0.1;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 240, 180, ${alpha})`;
    ctx.fill();
  }

  // Turbulent convective bands
  for (let y = 0; y < height; y += 4) {
    ctx.fillStyle = `rgba(255, 120, 0, ${Math.sin(y * 0.1) * 0.15 + 0.15})`;
    ctx.fillRect(0, y, width, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache.sun = texture;
  return texture;
}

/**
 * Procedural Earth texture with oceans, continents, and atmospheric cloud bands
 */
export function getEarthTexture(): THREE.CanvasTexture {
  if (textureCache.earth) return textureCache.earth;

  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Deep ocean blue base
  ctx.fillStyle = '#081e3d';
  ctx.fillRect(0, 0, width, height);

  // Ocean depth variations
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, 'rgba(12, 42, 82, 0.6)');
  oceanGrad.addColorStop(0.5, 'rgba(8, 28, 56, 0.8)');
  oceanGrad.addColorStop(1, 'rgba(12, 42, 82, 0.6)');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Continents (procedural organic landmasses)
  ctx.fillStyle = '#1e482b'; // Forest/plains green
  const continents = [
    { x: 280, y: 180, rx: 110, ry: 70 }, // North America
    { x: 360, y: 340, rx: 70, ry: 100 },  // South America
    { x: 550, y: 190, rx: 90, ry: 60 },   // Europe
    { x: 580, y: 290, rx: 95, ry: 95 },   // Africa
    { x: 740, y: 170, rx: 160, ry: 85 },  // Asia
    { x: 860, y: 360, rx: 65, ry: 45 },   // Australia
  ];

  continents.forEach((c) => {
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.rx, c.ry, Math.PI / 12, 0, Math.PI * 2);
    ctx.fill();

    // Additional organic terrain blobs around continent
    for (let j = 0; j < 12; j++) {
      const angle = (j / 12) * Math.PI * 2;
      const dist = (c.rx * 0.7) * (0.8 + Math.random() * 0.5);
      const bx = c.x + Math.cos(angle) * dist;
      const by = c.y + Math.sin(angle) * dist * (c.ry / c.rx);
      const br = Math.random() * 25 + 10;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.4 ? '#2d5a3f' : '#6b5835'; // Green or mountain brown
      ctx.fill();
    }
  });

  // Polar ice caps (North & South)
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, 0, width, 32);
  ctx.fillRect(0, height - 36, width, 36);

  // Soft atmospheric cloud layer over continents
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let i = 0; i < 35; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * (height - 100) + 50;
    const crx = Math.random() * 90 + 30;
    const cry = Math.random() * 15 + 5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, crx, cry, Math.PI / 16, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  textureCache.earth = texture;
  return texture;
}

/**
 * Procedural Moon texture with lunar highland regolith and dark volcanic maria
 */
export function getMoonTexture(): THREE.CanvasTexture {
  if (textureCache.moon) return textureCache.moon;

  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Base highland anorthosite grey
  ctx.fillStyle = '#8b939e';
  ctx.fillRect(0, 0, width, height);

  // Lunar Maria (dark basaltic volcanic plains)
  const maria = [
    { x: 190, y: 100, rx: 65, ry: 45 }, // Mare Imbrium
    { x: 260, y: 130, rx: 45, ry: 40 }, // Mare Serenitatis
    { x: 310, y: 150, rx: 40, ry: 35 }, // Mare Tranquillitatis
    { x: 140, y: 150, rx: 50, ry: 60 }, // Oceanus Procellarum
    { x: 370, y: 160, rx: 35, ry: 30 }, // Mare Crisium
  ];

  ctx.fillStyle = '#47505c';
  maria.forEach((m) => {
    ctx.beginPath();
    ctx.ellipse(m.x, m.y, m.rx, m.ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Maria perimeter irregularity
    for (let k = 0; k < 8; k++) {
      const angle = (k / 8) * Math.PI * 2;
      const bx = m.x + Math.cos(angle) * m.rx * 0.9;
      const by = m.y + Math.sin(angle) * m.ry * 0.9;
      ctx.beginPath();
      ctx.arc(bx, by, Math.random() * 15 + 8, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Impact craters with bright ejecta rays
  for (let c = 0; c < 200; c++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 5 + 1.5;

    // Rim highlight
    ctx.beginPath();
    ctx.arc(x, y, r + 0.8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(230, 235, 245, 0.45)';
    ctx.fill();

    // Crater pit shadow
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = '#374151';
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  textureCache.moon = texture;
  return texture;
}

/**
 * Procedural Mars texture with iron oxide regolith, darker basalt plains, and polar caps
 */
export function getMarsTexture(): THREE.CanvasTexture {
  if (textureCache.mars) return textureCache.mars;

  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Base rusty red-orange surface (iron oxide)
  ctx.fillStyle = '#993d18';
  ctx.fillRect(0, 0, width, height);

  // Surface tonal variation
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#833112');
  grad.addColorStop(0.4, '#b44a1d');
  grad.addColorStop(0.7, '#993d18');
  grad.addColorStop(1, '#782a0d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Dark albedo volcanic plains (Syrtis Major, Acidalia Planitia)
  ctx.fillStyle = '#441d11';
  const plains = [
    { x: 310, y: 130, rx: 45, ry: 55 }, // Syrtis Major
    { x: 190, y: 90, rx: 70, ry: 35 },  // Acidalia Planitia
    { x: 160, y: 160, rx: 80, ry: 25 }, // Valles Marineris canyon strip
  ];

  plains.forEach((p) => {
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.rx, p.ry, Math.PI / 10, 0, Math.PI * 2);
    ctx.fill();
  });

  // Olympus Mons and Tharsis volcanic provinces (lighter elevation halos)
  ctx.fillStyle = '#c75928';
  ctx.beginPath();
  ctx.arc(110, 130, 22, 0, Math.PI * 2); // Olympus Mons
  ctx.fill();

  // Crater field spots
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 4 + 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(55, 20, 10, 0.4)';
    ctx.fill();
  }

  // Brilliant North & South CO2 / water ice polar caps
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, width, 18);
  ctx.fillRect(0, height - 22, width, 22);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  textureCache.mars = texture;
  return texture;
}
