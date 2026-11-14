import React, { useRef } from 'react';
import * as THREE from 'three';
import { RoverSimulationState } from './roverPhysics';

interface RoverModelProps {
  state: RoverSimulationState;
  activeMode: 'geotech' | 'autonomy' | 'drill';
}

export const RoverModel: React.FC<RoverModelProps> = ({ state, activeMode }) => {
  const drillSpinRef = useRef<THREE.Mesh>(null);

  const {
    x,
    y,
    z,
    heading,
    pitch,
    roll,
    steeringAngle,
    wheelRotation,
    drillActive,
    drillProgress,
    drillDeployed,
  } = state;

  // Arm articulation interpolation
  const armDownFactor = drillActive ? drillProgress : drillDeployed ? 1.0 : 0.0;
  const shoulderAngle = THREE.MathUtils.lerp(0.3, 1.45, armDownFactor);
  const elbowAngle = THREE.MathUtils.lerp(-0.4, 0.85, armDownFactor);

  return (
    <group
      position={[x, y + 0.42, z]}
      rotation={[pitch, heading, roll, 'YXZ']}
    >
      {/* ========================================================================= */}
      {/* 1. Main Chassis & Scientific Warm Electronics Bay (WEB)                  */}
      {/* ========================================================================= */}
      {/* Core Body Box */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.25, 0.42, 1.75]} />
        <meshStandardMaterial
          color="#f1f5f9"
          roughness={0.35}
          metalness={0.7}
        />
      </mesh>

      {/* Gold Multi-Layer Insulation (MLI) Foil Skirt Accent */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[1.28, 0.16, 1.78]} />
        <meshStandardMaterial
          color="#d97706"
          roughness={0.25}
          metalness={0.85}
        />
      </mesh>

      {/* Front Hazard Avoidance Cameras (HazCams) */}
      <mesh position={[0.35, 0.15, 0.9]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.18, 0.08, 0.08]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-0.35, 0.15, 0.9]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.18, 0.08, 0.08]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* ========================================================================= */}
      {/* 2. Top Equipment Deck, Solar Panels & Multi-Mission RTG                   */}
      {/* ========================================================================= */}
      {/* Photovoltaic Solar Array Deck */}
      <mesh position={[0, 0.44, 0.05]} receiveShadow>
        <boxGeometry args={[1.45, 0.03, 1.55]} />
        <meshStandardMaterial
          color="#1e1b4b"
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>

      {/* Photovoltaic Grid Wire Lines */}
      <gridHelper
        args={[1.4, 6, '#38bdf8', '#312e81']}
        position={[0, 0.46, 0.05]}
      />

      {/* Rear MMRTG Power Generator Canister */}
      <mesh position={[0, 0.32, -0.98]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.45, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.3} />
      </mesh>

      {/* High-Gain Steerable Parabolic Antenna (HGA) */}
      <group position={[-0.42, 0.52, -0.45]} rotation={[-0.4, 0.2, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.28, 0.05, 0.06, 24]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} />
        </mesh>
      </group>

      {/* Low-Gain Whip Antenna */}
      <mesh position={[0.48, 0.72, -0.55]}>
        <cylinderGeometry args={[0.01, 0.01, 0.55, 8]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.9} />
      </mesh>

      {/* ========================================================================= */}
      {/* 3. Remote Sensing Mast (MastCam & SuperCam Laser)                         */}
      {/* ========================================================================= */}
      <group position={[0.42, 0.45, 0.65]}>
        {/* Vertical Mast Pole */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Pan-Tilt Sensor Head */}
        <group position={[0, 0.92, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.18, 0.22]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} />
          </mesh>

          {/* Dual Stereo MastCam Lenses */}
          <mesh position={[-0.08, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.04, 16]} />
            <meshStandardMaterial color="#020617" roughness={0.05} metalness={0.95} />
          </mesh>
          <mesh position={[0.08, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.04, 16]} />
            <meshStandardMaterial color="#020617" roughness={0.05} metalness={0.95} />
          </mesh>

          {/* SuperCam Large Central Aperture */}
          <mesh position={[0, 0.05, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.05, 16]} />
            <meshStandardMaterial color="#ef4444" roughness={0.1} metalness={0.9} />
          </mesh>

          {/* Autonomy Mode Target Marker */}
          {activeMode === 'autonomy' && (
            <pointLight position={[0, 0, 0.3]} intensity={1.5} distance={6} color="#38bdf8" />
          )}
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 4. Articulated Robotic Arm (IDD) & Coring Drill Assembly                  */}
      {/* ========================================================================= */}
      <group position={[-0.45, 0.32, 0.72]}>
        {/* Shoulder Joint */}
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>

        {/* Upper Arm Segment */}
        <group rotation={[shoulderAngle, 0, 0.2]}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.6, 12]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
          </mesh>

          {/* Elbow Joint */}
          <group position={[0, -0.6, 0]} rotation={[elbowAngle, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.065, 16, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.9} />
            </mesh>

            {/* Forearm Segment */}
            <mesh position={[0, -0.25, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.5, 12]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
            </mesh>

            {/* Turret Head with Coring Drill */}
            <group position={[0, -0.5, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.18, 0.16, 0.2]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} />
              </mesh>

              {/* Rotary Coring Drill Bit */}
              <mesh
                ref={drillSpinRef}
                position={[0, -0.15, 0]}
                rotation={[0, drillActive ? state.wheelRotation * 10 : 0, 0]}
                castShadow
              >
                <cylinderGeometry args={[0.03, 0.015, 0.25, 12]} />
                <meshStandardMaterial color="#38bdf8" metalness={0.95} roughness={0.1} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 5. Rocker-Bogie Suspension Assembly                                       */}
      {/* ========================================================================= */}
      {/* Left Rocker Bar */}
      <mesh position={[-0.72, -0.05, 0]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.06, 0.06, 1.4]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>
      {/* Right Rocker Bar */}
      <mesh position={[0.72, -0.05, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.06, 0.06, 1.4]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>

      {/* ========================================================================= */}
      {/* 6. Six Machined Titanium Wheels with Cleats & Steering Articulation       */}
      {/* ========================================================================= */}
      {[
        { id: 'FL', x: -0.92, z: 0.75, isFront: true },
        { id: 'ML', x: -0.92, z: 0.0, isFront: false },
        { id: 'RL', x: -0.92, z: -0.75, isFront: false, isRear: true },
        { id: 'FR', x: 0.92, z: 0.75, isFront: true },
        { id: 'MR', x: 0.92, z: 0.0, isFront: false },
        { id: 'RR', x: 0.92, z: -0.75, isFront: false, isRear: true },
      ].map((w) => {
        // Front wheels steer with steeringAngle; rear wheels counter-steer for 4-wheel steering kinematics
        const steerRotY = w.isFront ? steeringAngle : w.isRear ? -steeringAngle * 0.5 : 0;

        return (
          <group key={w.id} position={[w.x, -0.18, w.z]} rotation={[0, steerRotY, 0]}>
            {/* Wheel Hub & Rotating Rim */}
            <group rotation={[wheelRotation, 0, 0]}>
              {/* Outer Wheel Tire Cylinder with Grousers */}
              <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
                <cylinderGeometry args={[0.3, 0.3, 0.24, 24]} />
                <meshStandardMaterial
                  color="#64748b"
                  metalness={0.85}
                  roughness={0.35}
                />
              </mesh>

              {/* Machined Aluminum Cleats / Chevron Grousers */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <mesh
                  key={i}
                  rotation={[0, 0, Math.PI / 2]}
                  position={[
                    0,
                    Math.cos((i * Math.PI) / 3) * 0.31,
                    Math.sin((i * Math.PI) / 3) * 0.31,
                  ]}
                >
                  <boxGeometry args={[0.25, 0.02, 0.04]} />
                  <meshStandardMaterial color="#94a3b8" metalness={0.9} />
                </mesh>
              ))}

              {/* Center Wheel Hub Bearing (Gold anodized aluminum) */}
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.12, 0.12, 0.26, 16]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          </group>
        );
      })}

      {/* Headlights for forward terrain illumination */}
      <spotLight
        position={[0.3, 0.2, 0.9]}
        target-position={[0.3, -1.0, 5.0]}
        intensity={2.0}
        angle={0.65}
        penumbra={0.5}
        color="#fff8e7"
      />
      <spotLight
        position={[-0.3, 0.2, 0.9]}
        target-position={[-0.3, -1.0, 5.0]}
        intensity={2.0}
        angle={0.65}
        penumbra={0.5}
        color="#fff8e7"
      />
    </group>
  );
};
