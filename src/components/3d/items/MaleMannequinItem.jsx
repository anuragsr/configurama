import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useConfigStore } from '../../../store/useConfigStore';
import { SKIN_TONES } from '../../../data/apparelRegistry';
import { buildEyeTexture } from './eyeTexture';

const MODEL_PATH = '/models/male-upper-eyes.glb';

// The eyes mesh (Object_722) needs its own material kept (not tinted with
// skin color) but no longer needs a position correction - the offset was
// fixed at the source in Blender.
const EYES_MESH_NAME = 'Object_722';

export const MaleMannequinItem = ({ position, scale, rotation }) => {
  const { scene } = useGLTF(MODEL_PATH);
  const skinTone = useConfigStore((state) => state.skinTone);

  const skinConfig = useMemo(() => {
    return SKIN_TONES.find((t) => t.id === skinTone) || SKIN_TONES[0];
  }, [skinTone]);

  const eyeTexture = useMemo(() => buildEyeTexture(), []);

  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.name === EYES_MESH_NAME) {
          // Source material's baseColor is flat black - reset to white so
          // the texture's real colors show instead of being multiplied out.
          const eyeMat = child.material.clone();
          eyeMat.map = eyeTexture;
          eyeMat.color = new THREE.Color(0xffffff);
          eyeMat.roughness = 0.3;
          eyeMat.needsUpdate = true;
          child.material = eyeMat;
          return;
        }

        const recolor = (mat) => {
          const cloned = mat.clone();
          cloned.color = new THREE.Color(skinConfig.hex);
          cloned.roughness = skinConfig.roughness;
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
  }, [scene, skinConfig, eyeTexture]);

  return (
    <group position={position} scale={scale} rotation={rotation}>
      <primitive object={clonedScene} />
    </group>
  );
};

useGLTF.preload(MODEL_PATH);
