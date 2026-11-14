import * as THREE from 'three';

export interface RoverSimulationState {
  // Position in world coordinates
  x: number;
  y: number;
  z: number;
  // Dynamic kinematics
  velocity: number;
  maxSpeed: number;
  acceleration: number;
  braking: number;
  // Angles in radians
  heading: number; // yaw
  steeringAngle: number; // steering
  pitch: number;
  roll: number;
  // Wheel rotation angle
  wheelRotation: number;
  // Wheel slip percentage
  wheelSlip: number;
  // Current terrain slope in degrees
  slopeDeg: number;
  // Autonomous waypoint navigation
  waypoint: { x: number; z: number } | null;
  isAutoNavigating: boolean;
  // Drill operation state
  drillActive: boolean;
  drillProgress: number; // 0 to 1
  drillDeployed: boolean;
  // Obstacle warning
  obstacleWarning: string | null;
}

export interface ObstacleBoulder {
  id: number;
  x: number;
  z: number;
  radius: number;
  height: number;
}

/**
 * Deterministic multi-frequency heightmap function for planetary terrain
 */
export function getTerrainHeight(x: number, z: number, planet: string = 'moon'): number {
  const p = planet.toLowerCase();

  // Bounded smooth falloff at perimeter
  const dist = Math.sqrt(x * x + z * z);
  const boundaryFactor = Math.max(0, 1 - (dist / 18) ** 4);

  if (p === 'mars') {
    // Martian dunes, ripples & canyon scarps
    const dune = Math.sin(x * 0.45 + Math.cos(z * 0.3) * 0.8) * 1.2;
    const ripple = Math.sin(x * 1.8 + z * 1.4) * 0.18;
    const mesa = Math.floor(Math.sin(x * 0.2) * Math.cos(z * 0.2) * 3) * 0.4;
    return (dune + ripple + mesa) * boundaryFactor;
  }

  // Moon: crater depression, rolling highlands & regolith mounds
  const craterDist = Math.sqrt((x - 4) ** 2 + (z + 3) ** 2);
  const crater = craterDist < 5 ? -Math.cos((craterDist / 5) * (Math.PI / 2)) * 1.8 : 0;
  const rim = craterDist >= 4.5 && craterDist <= 6.5 ? Math.sin(((craterDist - 4.5) / 2) * Math.PI) * 0.6 : 0;
  const rolling = Math.sin(x * 0.3) * Math.cos(z * 0.35) * 0.9;
  const micro = Math.sin(x * 1.2 + z * 0.8) * 0.15;

  return (crater + rim + rolling + micro) * boundaryFactor;
}

/**
 * Calculates surface normal at (x, z) using finite differences
 */
export function getTerrainNormal(x: number, z: number, planet: string = 'moon'): THREE.Vector3 {
  const eps = 0.2;
  const hL = getTerrainHeight(x - eps, z, planet);
  const hR = getTerrainHeight(x + eps, z, planet);
  const hD = getTerrainHeight(x, z - eps, planet);
  const hU = getTerrainHeight(x, z + eps, planet);

  const normal = new THREE.Vector3(
    (hL - hR) / (2 * eps),
    1.0,
    (hD - hU) / (2 * eps)
  ).normalize();

  return normal;
}

/**
 * Fixed boulder obstacles scattered across the simulation field
 */
export const SIMULATION_BOULDERS: ObstacleBoulder[] = [
  { id: 1, x: 5.2, z: 3.8, radius: 0.9, height: 0.8 },
  { id: 2, x: -6.4, z: 4.5, radius: 1.2, height: 1.0 },
  { id: 3, x: 3.5, z: -7.2, radius: 0.8, height: 0.7 },
  { id: 4, x: -5.8, z: -5.5, radius: 1.4, height: 1.1 },
  { id: 5, x: 8.5, z: -3.0, radius: 1.0, height: 0.85 },
  { id: 6, x: -2.0, z: 8.2, radius: 0.75, height: 0.65 },
  { id: 7, x: 7.0, z: 7.5, radius: 1.1, height: 0.95 },
  { id: 8, x: -8.5, z: 0.5, radius: 1.3, height: 1.05 },
];

/**
 * Initial rover state at simulation launch
 */
export function createInitialRoverState(): RoverSimulationState {
  const initX = 0;
  const initZ = 0;
  const initY = getTerrainHeight(initX, initZ, 'moon');

  return {
    x: initX,
    y: initY,
    z: initZ,
    velocity: 0,
    maxSpeed: 3.2,
    acceleration: 2.8,
    braking: 6.5,
    heading: 0,
    steeringAngle: 0,
    pitch: 0,
    roll: 0,
    wheelRotation: 0,
    wheelSlip: 0,
    slopeDeg: 0,
    waypoint: null,
    isAutoNavigating: false,
    drillActive: false,
    drillProgress: 0,
    drillDeployed: false,
    obstacleWarning: null,
  };
}

export interface RoverControlInputs {
  forward: boolean;
  reverse: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
}

/**
 * Deterministic kinematics step for the planetary rover
 */
export function updateRoverKinematics(
  state: RoverSimulationState,
  inputs: RoverControlInputs,
  planet: string,
  delta: number
): RoverSimulationState {
  // Clamp delta to prevent physics explosion on tab blur
  const dt = Math.min(0.08, delta);

  let {
    x,
    z,
    velocity,
    maxSpeed,
    acceleration,
    braking,
    heading,
    steeringAngle,
    wheelRotation,
    waypoint,
    isAutoNavigating,
    drillActive,
    drillProgress,
    drillDeployed,
  } = state;

  // If drill is active, rover is locked in stationary sample coring mode
  if (drillActive) {
    drillProgress = Math.min(1.0, drillProgress + dt * 0.35);
    if (drillProgress >= 1.0) {
      drillActive = false;
      drillDeployed = true;
    }
    return {
      ...state,
      velocity: 0,
      drillProgress,
      drillActive,
      drillDeployed,
    };
  }

  // 1. Autonomous Waypoint Navigation
  if (isAutoNavigating && waypoint) {
    const dx = waypoint.x - x;
    const dz = waypoint.z - z;
    const distToWp = Math.sqrt(dx * dx + dz * dz);

    if (distToWp < 0.6) {
      // Waypoint reached
      isAutoNavigating = false;
      waypoint = null;
      velocity = 0;
    } else {
      // Calculate target heading towards waypoint
      const targetHeading = Math.atan2(dx, dz);
      let angleDiff = targetHeading - heading;

      // Normalize angle difference to [-PI, PI]
      while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

      // Steer towards target
      const maxSteer = 0.55; // ~31 degrees
      steeringAngle = THREE.MathUtils.clamp(angleDiff * 1.5, -maxSteer, maxSteer);

      // Accelerate towards waypoint, slowing down as it nears
      const targetSpeed = Math.min(maxSpeed * 0.7, distToWp * 0.8);
      if (velocity < targetSpeed) {
        velocity = Math.min(targetSpeed, velocity + acceleration * dt);
      } else {
        velocity = Math.max(targetSpeed, velocity - braking * dt);
      }
    }
  } else {
    // 2. Manual Keyboard / UI Control Input
    const maxSteer = 0.52; // ~30 degrees
    const steerSpeed = 2.4;

    if (inputs.left) {
      steeringAngle = Math.max(-maxSteer, steeringAngle - steerSpeed * dt);
    } else if (inputs.right) {
      steeringAngle = Math.min(maxSteer, steeringAngle + steerSpeed * dt);
    } else {
      // Auto-center steering when key released
      if (steeringAngle > 0) {
        steeringAngle = Math.max(0, steeringAngle - steerSpeed * 1.8 * dt);
      } else if (steeringAngle < 0) {
        steeringAngle = Math.min(0, steeringAngle + steerSpeed * 1.8 * dt);
      }
    }

    if (inputs.brake) {
      if (velocity > 0) {
        velocity = Math.max(0, velocity - braking * dt);
      } else if (velocity < 0) {
        velocity = Math.min(0, velocity + braking * dt);
      }
    } else if (inputs.forward) {
      velocity = Math.min(maxSpeed, velocity + acceleration * dt);
    } else if (inputs.reverse) {
      velocity = Math.max(-maxSpeed * 0.55, velocity - acceleration * 0.8 * dt);
    } else {
      // Natural rolling friction resistance
      const friction = 1.4;
      if (velocity > 0) {
        velocity = Math.max(0, velocity - friction * dt);
      } else if (velocity < 0) {
        velocity = Math.min(0, velocity + friction * dt);
      }
    }
  }

  // 3. Bicycle Kinematics: Update Heading
  const wheelbase = 1.8; // Distance between front and rear axles
  if (Math.abs(velocity) > 0.01) {
    const turnAngularRate = (velocity / wheelbase) * Math.tan(steeringAngle);
    heading += turnAngularRate * dt;
  }

  // 4. Update Position
  const moveX = Math.sin(heading) * velocity * dt;
  const moveZ = Math.cos(heading) * velocity * dt;

  let nextX = x + moveX;
  let nextZ = z + moveZ;

  // Boundary clamping (simulation area boundary = 15m radius)
  const distFromCenter = Math.sqrt(nextX * nextX + nextZ * nextZ);
  if (distFromCenter > 14.5) {
    velocity = 0;
    nextX = (nextX / distFromCenter) * 14.4;
    nextZ = (nextZ / distFromCenter) * 14.4;
  }

  // 5. Boulder Collision & Proximity Detection
  let warning: string | null = null;
  const roverRadius = 1.1;

  for (const b of SIMULATION_BOULDERS) {
    const distToBoulder = Math.sqrt((nextX - b.x) ** 2 + (nextZ - b.z) ** 2);
    if (distToBoulder < roverRadius + b.radius * 0.65) {
      // Physical stop
      velocity = -velocity * 0.2;
      nextX = x;
      nextZ = z;
      warning = `COLLISION: BARK RESISTANCE (Boulder #${b.id})`;
      break;
    } else if (distToBoulder < roverRadius + b.radius + 1.2) {
      warning = `HAZARD WARNING: Obstacle Proximity (${distToBoulder.toFixed(1)}m)`;
    }
  }

  // 6. Terrain Grounding & Slope Alignment
  const nextY = getTerrainHeight(nextX, nextZ, planet);
  const normal = getTerrainNormal(nextX, nextZ, planet);

  // Slope calculation relative to horizontal
  const cosSlope = THREE.MathUtils.clamp(normal.y, 0, 1);
  const slopeDeg = Math.acos(cosSlope) * (180 / Math.PI);

  // Calculate body pitch and roll from normal vector
  const forwardVec = new THREE.Vector3(Math.sin(heading), 0, Math.cos(heading));
  const rightVec = new THREE.Vector3(Math.cos(heading), 0, -Math.sin(heading));

  const pitch = -forwardVec.dot(normal) * 0.9;
  const roll = rightVec.dot(normal) * 0.9;

  // Wheel slip increases significantly on slopes in loose regolith
  const wheelRadius = 0.35;
  const wheelRotationDelta = (velocity / wheelRadius) * dt;
  wheelRotation += wheelRotationDelta;

  const baseSlip = Math.abs(velocity) > 0.1 ? 2.5 : 0;
  const slopeSlip = (slopeDeg / 25) * 18.0;
  const wheelSlip = Math.min(45, baseSlip + slopeSlip);

  return {
    ...state,
    x: nextX,
    y: nextY,
    z: nextZ,
    velocity,
    heading,
    steeringAngle,
    pitch,
    roll,
    wheelRotation,
    wheelSlip,
    slopeDeg,
    waypoint,
    isAutoNavigating,
    drillActive,
    drillProgress,
    drillDeployed,
    obstacleWarning: warning,
  };
}
