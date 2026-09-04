import React, { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import { useConfigStore } from '../../../store/useConfigStore';

const MODEL_PATH = '/models/tshirt_rigged.glb';

// Rigged against the male mannequin's own skeleton (see HumanMannequin.jsx) -
// carries its own copy of the same armature so it can be posed independently
// without needing to share a THREE.Skeleton with the body mesh.
export const RiggedTshirtItem = () => {
  const { scene } = useGLTF(MODEL_PATH);
  const pose = useConfigStore((state) => state.pose);
  const restRotationsRef = useRef(new Map());

  const clonedScene = useMemo(() => {
    const cloned = SkeletonUtils.clone(scene);

    restRotationsRef.current.clear();
    cloned.traverse((child) => {
      if (child.isBone) {
        restRotationsRef.current.set(child.name, child.quaternion.clone());
      }
      if (child.isMesh || child.isSkinnedMesh) {
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

  // Mirrors the arm-posing logic in HumanMannequin.jsx so the sleeves track
  // the mannequin's own pose changes in lockstep.
  useFrame(() => {
    if (!clonedScene || restRotationsRef.current.size === 0) return;

    const leftArm = clonedScene.getObjectByName('DEF-upper_armL_1553');
    const rightArm = clonedScene.getObjectByName('DEF-upper_armR_1677');

    const resetBone = (bone) => {
      if (bone && restRotationsRef.current.has(bone.name)) {
        bone.quaternion.copy(restRotationsRef.current.get(bone.name));
      }
    };

    resetBone(leftArm);
    resetBone(rightArm);

    if (pose === 'a_pose') {
      if (leftArm) leftArm.rotateZ(-0.75);
      if (rightArm) rightArm.rotateZ(0.75);
    }
  });

  return <primitive object={clonedScene} />;
};

useGLTF.preload(MODEL_PATH);
