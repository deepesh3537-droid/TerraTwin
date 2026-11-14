import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { RoverSimulationState } from './roverPhysics';

export type RoverCameraMode = 'follow' | 'free' | 'topdown' | 'mastcam';

interface RoverCameraSystemProps {
  cameraMode: RoverCameraMode;
  state: RoverSimulationState;
}

export const RoverCameraSystem: React.FC<RoverCameraSystemProps> = ({
  cameraMode,
  state,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const dt = Math.min(0.1, delta);
    const targetPos = new THREE.Vector3(state.x, state.y + 0.6, state.z);

    if (cameraMode === 'follow') {
      // Third-person chase cam positioned behind rover based on heading
      const followDistance = 6.8;
      const followHeight = 3.4;

      const idealX = state.x - Math.sin(state.heading) * followDistance;
      const idealZ = state.z - Math.cos(state.heading) * followDistance;
      const idealY = state.y + followHeight;

      // Smooth camera interpolation
      camera.position.lerp(new THREE.Vector3(idealX, idealY, idealZ), dt * 4.5);
      currentLookAt.current.lerp(targetPos, dt * 5.0);
      camera.lookAt(currentLookAt.current);
    } else if (cameraMode === 'topdown') {
      // Orthographic-style overhead bird's-eye view
      const idealPos = new THREE.Vector3(state.x, state.y + 16, state.z);
      camera.position.lerp(idealPos, dt * 5.0);
      currentLookAt.current.lerp(targetPos, dt * 6.0);
      camera.lookAt(currentLookAt.current);
    } else if (cameraMode === 'mastcam') {
      // Driver MastCam forward first-person view
      const mastHeight = 1.35;
      const mastForwardOffset = 0.55;
      const mastX = state.x + Math.sin(state.heading) * mastForwardOffset;
      const mastZ = state.z + Math.cos(state.heading) * mastForwardOffset;
      const mastY = state.y + mastHeight;

      const forwardTarget = new THREE.Vector3(
        state.x + Math.sin(state.heading) * 12,
        state.y + 0.6,
        state.z + Math.cos(state.heading) * 12
      );

      camera.position.set(mastX, mastY, mastZ);
      currentLookAt.current.lerp(forwardTarget, dt * 8.0);
      camera.lookAt(currentLookAt.current);
    } else if (cameraMode === 'free') {
      // Free orbit mode: update OrbitControls target to follow rover
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetPos, dt * 3.5);
        controlsRef.current.update();
      }
    }
  });

  return (
    <>
      {cameraMode === 'free' && (
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          minDistance={3.5}
          maxDistance={25}
          rotateSpeed={0.7}
          zoomSpeed={0.85}
        />
      )}
    </>
  );
};
