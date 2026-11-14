import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { getMoonTexture } from './textures';

interface PlanetProps {
  id: string;
  name: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed?: number;
  initialAngle?: number;
  texture: THREE.CanvasTexture;
  glowColor?: string;
  isTarget?: boolean;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: (id: string, worldPosition: THREE.Vector3) => void;
  onHover?: (id: string | null) => void;
}

export const Planet: React.FC<PlanetProps> = ({
  id,
  name,
  radius,
  orbitRadius,
  orbitSpeed,
  rotationSpeed = 0.4,
  initialAngle = 0,
  texture,
  glowColor,
  isTarget = false,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
}) => {
  const pivotGroupRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const moonOrbitRef = useRef<THREE.Group>(null);
  const angleRef = useRef<number>(initialAngle);

  // Cached moon texture for Earth's orbiting companion
  const moonTexture = useMemo(() => (id === 'earth' ? getMoonTexture() : null), [id]);

  useFrame((_, delta) => {
    // Orbital motion around the Sun
    angleRef.current += delta * orbitSpeed * 0.15;
    if (pivotGroupRef.current) {
      const x = Math.cos(angleRef.current) * orbitRadius;
      const z = Math.sin(angleRef.current) * orbitRadius;
      pivotGroupRef.current.position.set(x, 0, z);
    }

    // Axial self-rotation
    if (planetMeshRef.current) {
      planetMeshRef.current.rotation.y += delta * rotationSpeed;
    }

    // Moon sub-orbital rotation around Earth
    if (moonOrbitRef.current) {
      moonOrbitRef.current.rotation.y += delta * 0.8;
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (onSelect && pivotGroupRef.current) {
      const worldPos = new THREE.Vector3();
      pivotGroupRef.current.getWorldPosition(worldPos);
      onSelect(id, worldPos);
    }
  };

  const active = isSelected || isHovered;

  return (
    <group ref={pivotGroupRef}>
      {/* Interactive Planet Sphere */}
      <mesh
        ref={planetMeshRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover?.(id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover?.(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[radius, 36, 36]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.7}
          metalness={0.1}
          emissive={active ? new THREE.Color(glowColor || '#38bdf8') : new THREE.Color('#000000')}
          emissiveIntensity={active ? 0.35 : 0.0}
        />
      </mesh>

      {/* Atmospheric Glow Shell for Earth & Mars */}
      {glowColor && (
        <mesh>
          <sphereGeometry args={[radius * 1.08, 24, 24]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={active ? 0.35 : 0.18}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Selection / Hover Indicator Rings */}
      {active && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.35, radius * 1.45, 32]} />
          <meshBasicMaterial
            color={glowColor || '#38bdf8'}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Earth's Orbiting Moon */}
      {id === 'earth' && moonTexture && (
        <group ref={moonOrbitRef}>
          <mesh
            position={[radius + 1.2, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              if (onSelect && pivotGroupRef.current) {
                const worldPos = new THREE.Vector3();
                pivotGroupRef.current.getWorldPosition(worldPos);
                onSelect('moon', worldPos);
              }
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover?.('moon');
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              onHover?.(null);
              document.body.style.cursor = 'auto';
            }}
          >
            <sphereGeometry args={[0.26, 20, 20]} />
            <meshStandardMaterial
              map={moonTexture}
              roughness={0.8}
            />
          </mesh>
          {/* Subtle Moon Orbit Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius + 1.18, radius + 1.22, 32]} />
            <meshBasicMaterial
              color="#94a3b8"
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* Floating 3D Scientific Name Label */}
      {(active || isTarget) && (
        <Html
          position={[0, radius + 0.65, 0]}
          center
          distanceFactor={18}
          className="pointer-events-none select-none transition-opacity duration-300"
        >
          <div
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap border backdrop-blur-md transition-all ${
              isSelected
                ? 'bg-sky-950/85 text-sky-300 border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                : isHovered
                ? 'bg-space-900/90 text-slate-100 border-slate-400 scale-105'
                : 'bg-space-950/70 text-slate-400 border-space-border/60'
            }`}
          >
            <span className="font-semibold uppercase">{name}</span>
            {isTarget && (
              <span className="ml-1.5 text-[9px] text-sky-400 font-normal">
                {id === 'earth' ? '· REF BODY' : '· ANALOG TARGET'}
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};
