import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useConfigStore } from '../../../store/useConfigStore';
import { FABRICS } from '../../../data/apparelRegistry';

// Source files can come in inconsistent units/pivots, so instead of
// hardcoding per-file scale numbers we normalize at runtime: center the
// mesh on X/Z, sit it on Y=0, and scale it to a target real-world height.
// `position`/`rotation` then place that normalized, bottom-anchored unit.
const TARGET_HEIGHT = 0.72;

export const TshirtItem = ({
  modelPath = '/models/tshirt-default.glb',
  position,
  scale = 1,
  rotation,
  raw = false,
  slotKey = 'tshirt',
}) => {
  const { scene } = useGLTF(modelPath);
  const slot = useConfigStore((state) => state.slots[slotKey]);

  // Map material name -> hex color from the store, e.g. { Polo_Shirt: '#fff', Button: '#000' }
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

    // `raw` skips normalization entirely - used to inspect a model's actual
    // exported scale/pivot with no transforms applied on top.
    if (raw) return cloned;

    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const normalizeScale = size.y > 0 ? TARGET_HEIGHT / size.y : 1;
    cloned.position.set(
      -center.x * normalizeScale,
      -box.min.y * normalizeScale,
      -center.z * normalizeScale
    );
    cloned.scale.setScalar(normalizeScale);

    return cloned;
  }, [scene, raw, colorsByMaterialName, fabricConfig]);

  if (slot && !slot.enabled) return null;

  return (
    <group position={position} scale={scale} rotation={rotation}>
      <primitive object={clonedScene} />
    </group>
  );
};

useGLTF.preload('/models/tshirt-default.glb');
