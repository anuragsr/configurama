import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useConfigStore } from '../../store/useConfigStore';
import { CapItem } from './items/CapItem';
import { TshirtItem } from './items/TshirtItem';
import { MaleMannequinItem } from './items/MaleMannequinItem';
import { PantItem } from './items/PantItem';
import { ShoesItem } from './items/ShoesItem';

export const ApparelStage = () => {
  const stageGroupRef = useRef();
  const autoRotate = useConfigStore((state) => state.autoRotate);
  const cameraResetSignal = useConfigStore((state) => state.cameraResetSignal);

  useFrame((_, delta) => {
    if (stageGroupRef.current && autoRotate) {
      stageGroupRef.current.rotation.y += delta * 0.4;
    }
  });

  // The turntable auto-rotate spins this group's Y rotation away from 0 -
  // snap it back whenever a camera/view reset is triggered (Full View,
  // Reset to Defaults), so "reset" also means "facing forward again".
  useEffect(() => {
    if (stageGroupRef.current) {
      stageGroupRef.current.rotation.y = 0;
    }
  }, [cameraResetSignal]);

  // Cap position/scale (reduced 10% from original)
  // Nudged down 30px total (-0.030) and back 5px (-0.005) on Z
  const capPosition = [0, 1.61, 0.007];
  const capScale = [0.000872, 0.000872, 0.000872];
  const capRotation = [0.05, 0, 0];

  // All garment/mannequin glb components live under one group so they can
  // be moved together on the Y axis (e.g. to raise/lower the whole outfit
  // as a unit) without re-tuning each item's individual position.
  const outfitY = 0.1;

  return (
    <group ref={stageGroupRef} position={[0, 0, 0]}>
      <group position={[0, outfitY, 0]}>
        {/* 3D Cap Item Fitted to Head */}
        <CapItem position={capPosition} scale={capScale} rotation={capRotation} />

        {/* tshirt-default.glb shown raw - no transforms applied, to inspect actual exported size */}
        <TshirtItem modelPath="/models/tshirt-default.glb" raw />

        {/* Male mannequin exported from Blender (posed, arms lowered) */}
        <MaleMannequinItem />

        {/* pant-default.glb shown at its exported transform */}
        <PantItem />

        {/* shoes1.glb shown at its exported transform */}
        <ShoesItem />
      </group>
    </group>
  );
};
