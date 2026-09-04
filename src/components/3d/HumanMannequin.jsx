import React, { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import { useConfigStore } from '../../store/useConfigStore';
import { SKIN_TONES } from '../../data/apparelRegistry';

const MODEL_PATH = '/models/human_malefemale_basemesh_rigged.glb';

export const HumanMannequin = () => {
  const { scene } = useGLTF(MODEL_PATH);
  const gender = useConfigStore((state) => state.gender);
  const showMannequin = useConfigStore((state) => state.showMannequin);
  const skinTone = useConfigStore((state) => state.skinTone);
  const pose = useConfigStore((state) => state.pose);

  const isFemale = gender === 'female';

  // Find skin tone settings
  const skinConfig = useMemo(() => {
    return SKIN_TONES.find((s) => s.id === skinTone) || SKIN_TONES[1];
  }, [skinTone]);

  // Realistic human skin physical material with clearcoat and soft subsurface sheen
  const humanSkinMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(skinConfig.hex),
      roughness: skinConfig.roughness,
      metalness: 0.0,
      clearcoat: 0.08,
      clearcoatRoughness: 0.25,
      reflectivity: 0.5,
      sheen: 0.4,
      sheenColor: new THREE.Color(skinConfig.hex).offsetHSL(0.02, 0.1, 0.05),
      sheenRoughness: 0.5,
    });
    mat.needsUpdate = true;
    return mat;
  }, [skinConfig]);

  const eyesMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: 0x1a1a1a,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    });
  }, []);

  // Store rest quaternions for all bones in the rig
  const restRotationsRef = useRef(new Map());

  // Clone scene with intact skeleton bones
  const clonedScene = useMemo(() => {
    if (!scene) return null;
    const cloned = SkeletonUtils.clone(scene);

    restRotationsRef.current.clear();
    cloned.traverse((child) => {
      if (child.isBone) {
        restRotationsRef.current.set(child.name, child.quaternion.clone());
      }
      if (child.isMesh || child.isSkinnedMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.name.toLowerCase().includes('eye')) {
          child.material = eyesMaterial;
        } else {
          child.material = humanSkinMaterial;
        }
      }
    });

    return cloned;
  }, [scene, humanSkinMaterial, eyesMaterial]);

  // Adjust gender subtree visibility
  useMemo(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      const name = child.name || '';
      if (name.includes('Female')) {
        child.visible = isFemale;
      }
      if (name.includes('Male')) {
        child.visible = !isFemale;
      }
    });
  }, [clonedScene, isFemale]);

  // Apply skeletal posing continuously on each render frame
  useFrame(() => {
    if (!clonedScene || restRotationsRef.current.size === 0) return;

    // Three.js GLTFLoader sanitizes bone names by removing dots ('.')
    // Female rig bones:
    const fUpperArmL = clonedScene.getObjectByName('DEF-upper_armL_685');
    const fUpperArmR = clonedScene.getObjectByName('DEF-upper_armR_809');

    // Male rig bones:
    const mUpperArmL = clonedScene.getObjectByName('DEF-upper_armL_1553');
    const mUpperArmR = clonedScene.getObjectByName('DEF-upper_armR_1677');

    const leftArm = isFemale ? fUpperArmL : mUpperArmL;
    const rightArm = isFemale ? fUpperArmR : mUpperArmR;

    const resetBone = (bone) => {
      if (bone && restRotationsRef.current.has(bone.name)) {
        bone.quaternion.copy(restRotationsRef.current.get(bone.name));
      }
    };

    resetBone(leftArm);
    resetBone(rightArm);

    // Apply rotation deltas based on pose
    // In this Blender armature: local Z axis rotates arms downward (Left: -Z, Right: +Z)
    if (pose === 'a_pose') {
      // ~45° downward angle (Natural A-pose)
      if (leftArm) leftArm.rotateZ(-0.75);
      if (rightArm) rightArm.rotateZ(0.75);
    }
    // t_pose: no extra rotation — rest bind pose is already T
  });

  if (!showMannequin || !clonedScene) return null;

  // Center active gender directly on [0, 0, 0]
  const offsetX = isFemale ? -0.687 : 0.645;

  return (
    <group position={[offsetX, 0, 0]}>
      <primitive object={clonedScene} />

      {/* Modern Studio Floor Stand / Base */}
      <mesh position={[-offsetX, 0.015, 0]} receiveShadow>
        <cylinderGeometry args={[0.38, 0.42, 0.03, 48]} />
        <meshStandardMaterial color="#18181b" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
};

useGLTF.preload(MODEL_PATH);
