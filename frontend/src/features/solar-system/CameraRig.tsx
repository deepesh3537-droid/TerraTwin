import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraRigProps {
  targetPlanetPosition: THREE.Vector3 | null;
  isTransitioning: boolean;
  onTransitionComplete?: () => void;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  targetPlanetPosition,
  isTransitioning,
  onTransitionComplete,
}) => {
  const { camera } = useThree();
  const defaultPos = useRef(new THREE.Vector3(0, 16, 36));
  const lookAtPos = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const transitionProgress = useRef(0);
  const transitionDone = useRef(false);

  useEffect(() => {
    transitionProgress.current = 0;
    transitionDone.current = false;
  }, [isTransitioning]);

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();

    if (isTransitioning) {
      // Cinematic Warp Fly-in towards selected planet
      transitionProgress.current += delta * 1.2;
      const targetLook = targetPlanetPosition || new THREE.Vector3(12, 0, 0);

      // Interpolate lookAt towards target
      currentLookAt.current.lerp(targetLook, delta * 5);
      camera.lookAt(currentLookAt.current);

      // Accelerate camera along vector towards planet
      const destPos = new THREE.Vector3()
        .copy(targetLook)
        .add(new THREE.Vector3(0, 0.4, 2.2)); // Close orbital distance

      camera.position.lerp(destPos, delta * 3.8);

      if (transitionProgress.current >= 1.0 && !transitionDone.current) {
        transitionDone.current = true;
        onTransitionComplete?.();
      }
      return;
    }

    if (targetPlanetPosition) {
      // Smooth focus zoom on selected planet
      const targetCameraPos = new THREE.Vector3()
        .copy(targetPlanetPosition)
        .add(new THREE.Vector3(1.8, 2.2, 5.5)); // Close inspection perspective

      camera.position.lerp(targetCameraPos, delta * 2.5);
      currentLookAt.current.lerp(targetPlanetPosition, delta * 3.0);
      camera.lookAt(currentLookAt.current);
    } else {
      // Cinematic alive ambient drift
      const ambientX = Math.sin(time * 0.08) * 3.5;
      const ambientZ = Math.cos(time * 0.08) * 2.0;
      const desiredPos = new THREE.Vector3(defaultPos.current.x + ambientX, 15 + Math.sin(time * 0.05) * 1.2, defaultPos.current.z + ambientZ);

      camera.position.lerp(desiredPos, delta * 1.5);
      currentLookAt.current.lerp(lookAtPos.current, delta * 2.0);
      camera.lookAt(currentLookAt.current);
    }
  });

  return null;
};
