import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useConfigStore } from '../../../store/useConfigStore';
import { SHOE_VARIANTS } from '../../../data/apparelRegistry';

export const ShoesItem = ({ position, scale, rotation }) => {
  const shoesSlot = useConfigStore((state) => state.slots.shoes);

  const activeVariant =
    SHOE_VARIANTS.find((v) => v.id === shoesSlot?.variant) || SHOE_VARIANTS[0];

  const { scene } = useGLTF(activeVariant.modelPath);

  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (Array.isArray(child.material)) {
          child.material = child.material.map((m) => m.clone());
        } else if (child.material) {
          child.material = child.material.clone();
        }
      }
    });

    return cloned;
  }, [scene]);

  if (shoesSlot && !shoesSlot.enabled) return null;

  return (
    <group position={position} scale={scale} rotation={rotation}>
      <primitive object={clonedScene} />
    </group>
  );
};

SHOE_VARIANTS.forEach((v) => useGLTF.preload(v.modelPath));
