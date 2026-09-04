import { useMemo } from 'react';
import * as THREE from 'three';

// Procedurally generated wood-grain texture (canvas-based), rather than a
// downloaded image file - avoids licensing/network concerns while still
// giving the platform a genuine wood-grain look.
function buildWoodTexture() {
  const width = 512;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Base wood tone
  ctx.fillStyle = '#a9743f';
  ctx.fillRect(0, 0, width, height);

  // Wavy grain streaks running across the plank
  const streakCount = 40;
  for (let i = 0; i < streakCount; i++) {
    const y = (i / streakCount) * height + (Math.random() - 0.5) * 6;
    const shade = 0.75 + Math.random() * 0.4; // darker/lighter variation
    const brown = [90 * shade, 58 * shade, 30 * shade];
    ctx.strokeStyle = `rgba(${brown[0]}, ${brown[1]}, ${brown[2]}, ${0.35 + Math.random() * 0.25})`;
    ctx.lineWidth = 1.5 + Math.random() * 3;

    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= width; x += 32) {
      const wobble = Math.sin(x * 0.02 + i) * 6 + (Math.random() - 0.5) * 4;
      ctx.lineTo(x, y + wobble);
    }
    ctx.stroke();
  }

  // Fine noise speckle for texture grit
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 14;
    data[i] += noise;
    data[i + 1] += noise;
    data[i + 2] += noise;
  }
  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

export const WoodFloor = ({ radius = 1.6, height = 0.05 }) => {
  const woodTexture = useMemo(() => buildWoodTexture(), []);

  return (
    <mesh position={[0, -height / 2, 0]} receiveShadow>
      <cylinderGeometry args={[radius, radius, height, 96]} />
      <meshStandardMaterial map={woodTexture} roughness={0.75} metalness={0.05} />
    </mesh>
  );
};
