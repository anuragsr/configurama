import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { ApparelStage } from './ApparelStage';
import { CameraRig } from './CameraRig';
import { WoodFloor } from './WoodFloor';

export const Scene = ({ canvasRef }) => {
  const controlsRef = useRef();

  return (
    <div className="scene-container">
      <Canvas
        ref={canvasRef}
        shadows
        gl={{
          alpha: true,
          preserveDrawingBuffer: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        camera={{ position: [0, 1.1, 3.2], fov: 42 }}
      >
        {/* Studio Lighting Setup */}
        <ambientLight intensity={0.35} />

        {/* Key Light */}
        <directionalLight
          position={[4, 6, 4]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={15}
          shadow-camera-left={-2}
          shadow-camera-right={2}
          shadow-camera-top={2.5}
          shadow-camera-bottom={-0.5}
          shadow-bias={-0.0001}
        />

        {/* Fill Light (Soft Blue-ish) */}
        <pointLight position={[-4, 3, -2]} intensity={0.4} color="#e0f2fe" />

        {/* Rim Light (Warm accent) */}
        <pointLight position={[0, 4, -4]} intensity={0.6} color="#fef3c7" />

        {/* Front Soft Fill */}
        <pointLight position={[0, 1.5, 3]} intensity={0.25} />

        {/* Stage Studio Floor - low wooden cylinder platform */}
        <WoodFloor radius={1.6} height={0.05} />

        {/* Camera Rig & Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          minDistance={0.5}
          maxDistance={6.0}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2 - 0.02}
          enableDamping={true}
          dampingFactor={0.06}
        />
        <CameraRig controlsRef={controlsRef} />

        {/* 3D Apparel Models */}
        <Suspense fallback={null}>
          <ApparelStage />
        </Suspense>
      </Canvas>
    </div>
  );
};
