import * as THREE from 'three';

// Procedurally generated eye texture (sclera + iris + pupil + highlight),
// rather than a downloaded image - avoids licensing/network concerns while
// still giving the eye mesh a real look instead of flat black.
export function buildEyeTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // The eyeball mesh's forward-facing point (where the iris should sit)
  // maps to UV (0.25, 0.5), not the texture's geometric center - verified
  // by reading the mesh's actual POSITION/TEXCOORD_0 accessors and finding
  // the max-Z (most forward-bulging) vertex's UV.
  const cx = size * 0.25;
  const cy = size * 0.5;

  // Sclera (white of the eye)
  ctx.fillStyle = '#f4f0e8';
  ctx.fillRect(0, 0, size, size);

  // Faint red vein streaks near the edges
  for (let i = 0; i < 14; i++) {
    const angle = Math.random() * Math.PI * 2;
    const startR = size * 0.42;
    const endR = size * 0.2 + Math.random() * size * 0.15;
    ctx.strokeStyle = `rgba(200, 90, 90, ${0.08 + Math.random() * 0.1})`;
    ctx.lineWidth = 1 + Math.random();
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * startR, cy + Math.sin(angle) * startR);
    ctx.lineTo(cx + Math.cos(angle) * endR, cy + Math.sin(angle) * endR);
    ctx.stroke();
  }

  // Iris - hazel/brown with radial streaks
  const irisRadius = size * 0.22;
  const irisGradient = ctx.createRadialGradient(cx, cy, irisRadius * 0.1, cx, cy, irisRadius);
  irisGradient.addColorStop(0, '#6b4a2f');
  irisGradient.addColorStop(0.6, '#4a3320');
  irisGradient.addColorStop(1, '#2b1c10');
  ctx.fillStyle = irisGradient;
  ctx.beginPath();
  ctx.arc(cx, cy, irisRadius, 0, Math.PI * 2);
  ctx.fill();

  // Radial iris streaks
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * Math.PI * 2;
    const shade = Math.random() > 0.5 ? 'rgba(120, 85, 50, 0.3)' : 'rgba(30, 18, 10, 0.3)';
    ctx.strokeStyle = shade;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * irisRadius * 0.15, cy + Math.sin(angle) * irisRadius * 0.15);
    ctx.lineTo(cx + Math.cos(angle) * irisRadius * 0.95, cy + Math.sin(angle) * irisRadius * 0.95);
    ctx.stroke();
  }

  // Pupil
  ctx.fillStyle = '#050505';
  ctx.beginPath();
  ctx.arc(cx, cy, irisRadius * 0.42, 0, Math.PI * 2);
  ctx.fill();

  // Ring around the iris
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, irisRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Specular highlight glint
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.arc(cx - irisRadius * 0.3, cy - irisRadius * 0.3, irisRadius * 0.12, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
