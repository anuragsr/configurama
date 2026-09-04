import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useConfigStore } from '../../../store/useConfigStore';
import { FABRICS } from '../../../data/apparelRegistry';

const MODEL_PATH = '/models/baseball_cap.glb';

export const CapItem = ({
  position = [0, 1.70, 0.02],
  scale = [0.022, 0.022, 0.022],
  rotation = [0.08, 0, 0],
}) => {
  const { nodes, materials } = useGLTF(MODEL_PATH);
  const capSlot = useConfigStore((state) => state.slots.cap);

  // Get fabric parameters
  const fabricConfig = useMemo(() => {
    return FABRICS.find((f) => f.id === capSlot.fabric) || FABRICS[0];
  }, [capSlot.fabric]);

  // Clone materials with dynamic colors and fabric roughness/metalness
  const customMaterials = useMemo(() => {
    if (!materials || !materials.baseballCap) return null;

    const createMat = (colorHex) => {
      const mat = materials.baseballCap.clone();
      mat.color = new THREE.Color(colorHex);
      mat.roughness = fabricConfig.roughness;
      mat.metalness = fabricConfig.metalness;
      mat.needsUpdate = true;
      return mat;
    };

    const plasticMat = materials.plastic ? materials.plastic.clone() : materials.baseballCap.clone();
    plasticMat.color = new THREE.Color(capSlot.parts.backStrip.color);
    plasticMat.roughness = 0.4;
    plasticMat.metalness = 0.1;
    plasticMat.needsUpdate = true;

    return {
      crown: createMat(capSlot.parts.crown.color),
      brim: createMat(capSlot.parts.brim.color),
      topButton: createMat(capSlot.parts.topButton.color),
      underwire: createMat(capSlot.parts.underwire.color),
      backStrip: plasticMat,
    };
  }, [materials, capSlot.parts, capSlot.fabric, fabricConfig]);

  if (!capSlot.enabled || !nodes || !customMaterials) {
    return null;
  }

  // The base mesh in baseball_cap.glb has an internal center offset at [0.005, -2.9, -11.842]
  // and is oriented forward along +Z when rotated by [0, 0, 0]
  return (
    <group position={position} scale={scale} rotation={rotation} dispose={null}>
      {/* Top Button */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.baseballCap.geometry}
        material={customMaterials.topButton}
        position={[0.005, -2.9, -11.842]}
        rotation={[-0.161, 0, 0]}
        scale={20.118}
      />
      {/* Brim / Visor */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.baseballCap_1.geometry}
        material={customMaterials.brim}
        position={[0.005, -2.9, -11.842]}
        rotation={[-0.161, 0, 0]}
        scale={20.118}
      />
      {/* Snapback Strap */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.plastic.geometry}
        material={customMaterials.backStrip}
        position={[0.005, -2.9, -11.842]}
        rotation={[-0.161, 0, 0]}
        scale={20.118}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.plastic_1.geometry}
        material={customMaterials.backStrip}
        position={[0.005, -2.9, -11.842]}
        rotation={[-0.161, 0, 0]}
        scale={20.118}
      />
      {/* Underwire / Underside */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.baseballCap_2.geometry}
        material={customMaterials.underwire}
        position={[0.005, -2.9, -11.842]}
        rotation={[-0.161, 0, 0]}
        scale={20.118}
      />
      {/* Crown */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.baseballCap_3.geometry}
        material={customMaterials.crown}
        position={[0.005, -2.9, -11.842]}
        rotation={[-0.161, 0, 0]}
        scale={20.118}
      />
    </group>
  );
};

useGLTF.preload(MODEL_PATH);
