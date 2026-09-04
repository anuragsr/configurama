import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useConfigStore } from '../../store/useConfigStore';
import { CATEGORIES } from '../../data/apparelRegistry';

export const CameraRig = ({ controlsRef }) => {
  const { camera } = useThree();
  const activeCategory = useConfigStore((state) => state.activeCategory);
  const cameraResetSignal = useConfigStore((state) => state.cameraResetSignal);

  const targetPosRef = useRef(new THREE.Vector3(0, 1.1, 3.2));
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0.9, 0));
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    // Depends on cameraResetSignal too so "Full View" still re-triggers the
    // animation when activeCategory is already 'all' (setting state to its
    // current value wouldn't otherwise re-run this effect).
    const catConfig = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];
    if (catConfig) {
      targetPosRef.current.set(...catConfig.cameraPos);
      targetLookAtRef.current.set(...catConfig.cameraTarget);
      isAnimatingRef.current = true;
    }
  }, [activeCategory, cameraResetSignal]);

  useFrame((_, delta) => {
    // Only drive the camera while transitioning to a new category target.
    // Once it settles, hand full control back to OrbitControls so user
    // drags/zooms stick instead of being pulled back every frame.
    if (!isAnimatingRef.current) return;

    const step = Math.min(delta * 4.5, 0.15);

    camera.position.lerp(targetPosRef.current, step);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAtRef.current, step);
      controlsRef.current.update();
    }

    const posDone = camera.position.distanceToSquared(targetPosRef.current) < 0.0001;
    const targetDone =
      !controlsRef.current ||
      controlsRef.current.target.distanceToSquared(targetLookAtRef.current) < 0.0001;

    if (posDone && targetDone) {
      isAnimatingRef.current = false;
    }
  });

  return null;
};
