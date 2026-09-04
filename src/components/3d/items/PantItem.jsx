import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useConfigStore } from '../../../store/useConfigStore';
import { FABRICS } from '../../../data/apparelRegistry';

const MODEL_PATH = '/models/pant-default.glb';

export const PantItem = ({ position, scale, rotation, slotKey = 'bottom' }) => {
  const { scene } = useGLTF(MODEL_PATH);
  const slot = useConfigStore((state) => state.slots[slotKey]);

  // Map material name -> hex color from the store, e.g. { pants: '#1e293b' }
  const colorsByMaterialName = useMemo(() => {
    if (!slot) return {};
    return Object.values(slot.parts).reduce((acc, part) => {
      if (part.material) acc[part.material] = part.color;
      return acc;
    }, {});
  }, [slot]);

  const fabricConfig = useMemo(() => {
    return FABRICS.find((f) => f.id === slot?.fabric) || FABRICS[0];
  }, [slot?.fabric]);

  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const recolor = (mat) => {
          const cloned = mat.clone();
          const hex = colorsByMaterialName[mat.name];
          if (hex) {
            cloned.color = new THREE.Color(hex);
            // baseColorTexture multiplies against `color` - drop it so the
            // selected hex renders true instead of tinted/darkened by the
            // source fabric texture.
            cloned.map = null;
          }
          cloned.roughness = fabricConfig.roughness;
          cloned.metalness = fabricConfig.metalness;
          cloned.needsUpdate = true;
          return cloned;
        };

        if (Array.isArray(child.material)) {
          child.material = child.material.map(recolor);
        } else if (child.material) {
          child.material = recolor(child.material);
        }
      }
    });

    return cloned;
  }, [scene, colorsByMaterialName, fabricConfig]);

  if (slot && !slot.enabled) return null;

  return (
    <group position={position} scale={scale} rotation={rotation}>
      <primitive object={clonedScene} />
    </group>
  );
};

useGLTF.preload(MODEL_PATH);
