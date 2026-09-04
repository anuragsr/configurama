import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useConfigStore } from '../../store/useConfigStore';
import { FABRICS } from '../../data/apparelRegistry';

export const MannequinPlaceholder = () => {
  const gender = useConfigStore((state) => state.gender);
  const showMannequin = useConfigStore((state) => state.showMannequin);
  const slots = useConfigStore((state) => state.slots);

  const isFemale = gender === 'female';

  // Mannequin neutral material
  const mannequinMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0xd8d2cb,
      roughness: 0.5,
      metalness: 0.1,
    });
  }, []);

  // Dynamic slot materials
  const jacketMat = useMemo(() => {
    const s = slots.jacket;
    const f = FABRICS.find((fab) => fab.id === s.fabric) || FABRICS[0];
    return {
      body: new THREE.MeshStandardMaterial({
        color: s.parts.body.color,
        roughness: f.roughness,
        metalness: f.metalness,
      }),
      sleeves: new THREE.MeshStandardMaterial({
        color: s.parts.sleeves.color,
        roughness: f.roughness,
        metalness: f.metalness,
      }),
      rib: new THREE.MeshStandardMaterial({
        color: s.parts.collarRib.color,
        roughness: 0.8,
        metalness: 0.05,
      }),
    };
  }, [slots.jacket]);

  const bottomMat = useMemo(() => {
    const s = slots.bottom;
    const f = FABRICS.find((fab) => fab.id === s.fabric) || FABRICS[0];
    return {
      main: new THREE.MeshStandardMaterial({
        color: s.parts.main.color,
        roughness: f.roughness,
        metalness: f.metalness,
      }),
      pockets: new THREE.MeshStandardMaterial({
        color: s.parts.pockets.color,
        roughness: f.roughness,
        metalness: f.metalness,
      }),
    };
  }, [slots.bottom]);

  const shoesMat = useMemo(() => {
    const s = slots.shoes;
    const f = FABRICS.find((fab) => fab.id === s.fabric) || FABRICS[0];
    return {
      base: new THREE.MeshStandardMaterial({
        color: s.parts.base.color,
        roughness: f.roughness,
        metalness: f.metalness,
      }),
      accents: new THREE.MeshStandardMaterial({
        color: s.parts.accents.color,
        roughness: 0.3,
        metalness: 0.2,
      }),
      sole: new THREE.MeshStandardMaterial({
        color: s.parts.sole.color,
        roughness: 0.9,
        metalness: 0.0,
      }),
    };
  }, [slots.shoes]);

  const accessoriesMat = useMemo(() => {
    const s = slots.accessories;
    return {
      frame: new THREE.MeshStandardMaterial({
        color: s.parts.sunglasses.color,
        roughness: 0.2,
        metalness: 0.8,
      }),
      lens: new THREE.MeshPhysicalMaterial({
        color: s.parts.lenses.color,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.6,
        transparent: true,
        opacity: 0.85,
      }),
    };
  }, [slots.accessories]);

  const shoulderWidth = isFemale ? 0.38 : 0.46;
  const waistWidth = isFemale ? 0.28 : 0.34;
  const hipWidth = isFemale ? 0.36 : 0.35;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Mannequin Silhouette Base */}
      {showMannequin && (
        <group name="mannequin-base">
          {/* Head */}
          <mesh position={[0, 1.62, 0]} castShadow receiveShadow material={mannequinMat}>
            <sphereGeometry args={[0.11, 32, 32]} />
          </mesh>
          {/* Neck */}
          <mesh position={[0, 1.48, 0]} castShadow receiveShadow material={mannequinMat}>
            <cylinderGeometry args={[0.045, 0.055, 0.09, 24]} />
          </mesh>

          {/* Stand / Pole Base under feet */}
          <mesh position={[0, 0.02, 0]} receiveShadow>
            <cylinderGeometry args={[0.35, 0.38, 0.04, 32]} />
            <meshStandardMaterial color={0x262626} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.5, -0.15]} receiveShadow>
            <cylinderGeometry args={[0.015, 0.015, 1.0, 16]} />
            <meshStandardMaterial color={0x3f3f46} metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* 2. Outerwear / Jacket Slot */}
      {slots.jacket.enabled && (
        <group name="garment-jacket">
          {/* Torso Body */}
          <mesh position={[0, 1.25, 0]} castShadow receiveShadow material={jacketMat.body}>
            <cylinderGeometry args={[shoulderWidth * 0.5, waistWidth * 0.5, 0.38, 32]} />
          </mesh>
          {/* Ribbed Bottom Band */}
          <mesh position={[0, 1.04, 0]} castShadow receiveShadow material={jacketMat.rib}>
            <cylinderGeometry args={[waistWidth * 0.51, waistWidth * 0.51, 0.05, 32]} />
          </mesh>
          {/* Ribbed Collar */}
          <mesh position={[0, 1.45, 0]} castShadow receiveShadow material={jacketMat.rib}>
            <torusGeometry args={[0.065, 0.02, 16, 32]} />
          </mesh>
          {/* Left Sleeve */}
          <group position={[-shoulderWidth * 0.58, 1.25, 0]} rotation={[0, 0, 0.18]}>
            <mesh castShadow receiveShadow material={jacketMat.sleeves}>
              <cylinderGeometry args={[0.06, 0.05, 0.38, 24]} />
            </mesh>
            <mesh position={[0, -0.2, 0]} castShadow receiveShadow material={jacketMat.rib}>
              <cylinderGeometry args={[0.051, 0.051, 0.04, 24]} />
            </mesh>
          </group>
          {/* Right Sleeve */}
          <group position={[shoulderWidth * 0.58, 1.25, 0]} rotation={[0, 0, -0.18]}>
            <mesh castShadow receiveShadow material={jacketMat.sleeves}>
              <cylinderGeometry args={[0.06, 0.05, 0.38, 24]} />
            </mesh>
            <mesh position={[0, -0.2, 0]} castShadow receiveShadow material={jacketMat.rib}>
              <cylinderGeometry args={[0.051, 0.051, 0.04, 24]} />
            </mesh>
          </group>
        </group>
      )}

      {/* 3. Bottoms / Trousers Slot */}
      {slots.bottom.enabled && (
        <group name="garment-trousers">
          {/* Pelvis / Hips */}
          <mesh position={[0, 0.95, 0]} castShadow receiveShadow material={bottomMat.main}>
            <cylinderGeometry args={[waistWidth * 0.49, hipWidth * 0.5, 0.16, 32]} />
          </mesh>
          {/* Left Leg */}
          <mesh position={[-0.1, 0.54, 0]} castShadow receiveShadow material={bottomMat.main}>
            <cylinderGeometry args={[0.085, 0.065, 0.68, 24]} />
          </mesh>
          {/* Left Cargo Pocket */}
          <mesh position={[-0.18, 0.62, 0]} castShadow receiveShadow material={bottomMat.pockets}>
            <boxGeometry args={[0.03, 0.11, 0.09]} />
          </mesh>
          {/* Right Leg */}
          <mesh position={[0.1, 0.54, 0]} castShadow receiveShadow material={bottomMat.main}>
            <cylinderGeometry args={[0.085, 0.065, 0.68, 24]} />
          </mesh>
          {/* Right Cargo Pocket */}
          <mesh position={[0.18, 0.62, 0]} castShadow receiveShadow material={bottomMat.pockets}>
            <boxGeometry args={[0.03, 0.11, 0.09]} />
          </mesh>
        </group>
      )}

      {/* 4. Footwear / Shoes Slot */}
      {slots.shoes.enabled && (
        <group name="garment-shoes">
          {/* Left Shoe */}
          <group position={[-0.1, 0.08, 0.03]}>
            <mesh position={[0, 0.03, 0.03]} castShadow receiveShadow material={shoesMat.base}>
              <boxGeometry args={[0.1, 0.08, 0.22]} />
            </mesh>
            <mesh position={[0, -0.02, 0.03]} castShadow receiveShadow material={shoesMat.sole}>
              <boxGeometry args={[0.105, 0.03, 0.23]} />
            </mesh>
            <mesh position={[-0.052, 0.03, 0.02]} castShadow material={shoesMat.accents}>
              <boxGeometry args={[0.005, 0.03, 0.1]} />
            </mesh>
          </group>

          {/* Right Shoe */}
          <group position={[0.1, 0.08, 0.03]}>
            <mesh position={[0, 0.03, 0.03]} castShadow receiveShadow material={shoesMat.base}>
              <boxGeometry args={[0.1, 0.08, 0.22]} />
            </mesh>
            <mesh position={[0, -0.02, 0.03]} castShadow receiveShadow material={shoesMat.sole}>
              <boxGeometry args={[0.105, 0.03, 0.23]} />
            </mesh>
            <mesh position={[0.052, 0.03, 0.02]} castShadow material={shoesMat.accents}>
              <boxGeometry args={[0.005, 0.03, 0.1]} />
            </mesh>
          </group>
        </group>
      )}

      {/* 5. Accessories Slot (Sunglasses) */}
      {slots.accessories.enabled && (
        <group name="garment-accessories" position={[0, 1.63, 0.11]}>
          {/* Glasses Frame */}
          <mesh castShadow material={accessoriesMat.frame}>
            <boxGeometry args={[0.18, 0.035, 0.015]} />
          </mesh>
          {/* Left Lens */}
          <mesh position={[-0.05, 0, 0.005]} material={accessoriesMat.lens}>
            <boxGeometry args={[0.055, 0.03, 0.01]} />
          </mesh>
          {/* Right Lens */}
          <mesh position={[0.05, 0, 0.005]} material={accessoriesMat.lens}>
            <boxGeometry args={[0.055, 0.03, 0.01]} />
          </mesh>
        </group>
      )}
    </group>
  );
};
