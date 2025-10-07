/**
 * Photon Vanguard - Orbit Calculations
 * 방사형 궤도 경로 계산 유틸리티
 */

import type { OrbitPath, OrbitType, Position } from './types';

/**
 * 궤도 경로 생성
 */
export function createOrbitPath(
  type: OrbitType,
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  startAngle: number,
  rotationSpeed: number
): OrbitPath {
  return {
    type,
    centerX,
    centerY,
    radiusX,
    radiusY,
    startAngle,
    rotationSpeed,
  };
}

/**
 * 궤도 상의 위치 계산
 */
export function calculateOrbitPosition(orbit: OrbitPath, angle: number): Position {
  switch (orbit.type) {
    case 'radial':
      return calculateRadialPosition(orbit, angle);
    case 'elliptical':
      return calculateEllipticalPosition(orbit, angle);
    case 'spiral':
      return calculateSpiralPosition(orbit, angle);
    default:
      return { x: orbit.centerX, y: orbit.centerY };
  }
}

/**
 * 원형 궤도 위치 계산
 */
function calculateRadialPosition(orbit: OrbitPath, angle: number): Position {
  return {
    x: orbit.centerX + Math.cos(angle) * orbit.radiusX,
    y: orbit.centerY + Math.sin(angle) * orbit.radiusY,
  };
}

/**
 * 타원 궤도 위치 계산
 */
function calculateEllipticalPosition(orbit: OrbitPath, angle: number): Position {
  // 타원 방정식 사용
  const a = orbit.radiusX;
  const b = orbit.radiusY;

  return {
    x: orbit.centerX + a * Math.cos(angle),
    y: orbit.centerY + b * Math.sin(angle),
  };
}

/**
 * 나선형 궤도 위치 계산
 */
function calculateSpiralPosition(orbit: OrbitPath, angle: number): Position {
  // 점점 좁아지는 나선
  const spiralProgress = (angle % (Math.PI * 2)) / (Math.PI * 2);
  const currentRadius = orbit.radiusX * (1 - spiralProgress * 0.5);

  return {
    x: orbit.centerX + Math.cos(angle) * currentRadius,
    y: orbit.centerY + Math.sin(angle) * currentRadius,
  };
}

/**
 * 랜덤 궤도 생성 (화면 경계에서 시작)
 */
export function generateRandomOrbit(
  canvasWidth: number,
  canvasHeight: number,
  level: number
): OrbitPath {
  const types: OrbitType[] = ['radial', 'elliptical', 'spiral'];
  const type = types[Math.floor(Math.random() * types.length)];

  // 화면 경계 상의 랜덤 시작 위치
  const startAngle = Math.random() * Math.PI * 2;

  // 중심점 (화면 중앙 근처)
  const centerX = canvasWidth / 2 + (Math.random() - 0.5) * 100;
  const centerY = canvasHeight / 2 + (Math.random() - 0.5) * 100;

  // 궤도 반지름 (레벨에 따라 증가)
  const baseRadius = 100 + level * 10;
  const radiusX = baseRadius + Math.random() * 50;
  const radiusY = type === 'elliptical'
    ? radiusX * (0.5 + Math.random() * 0.5)
    : radiusX;

  // 회전 속도 (레벨에 따라 증가)
  const rotationSpeed = (0.5 + Math.random() * 0.5) * (1 + level * 0.1);

  return createOrbitPath(
    type,
    centerX,
    centerY,
    radiusX,
    radiusY,
    startAngle,
    rotationSpeed
  );
}

/**
 * 궤도 각도 업데이트
 */
export function updateOrbitAngle(
  currentAngle: number,
  rotationSpeed: number,
  deltaTime: number,
  slowFactor: number = 1
): number {
  const deltaSeconds = deltaTime / 1000;
  const angleIncrement = rotationSpeed * deltaSeconds * slowFactor;
  return (currentAngle + angleIncrement) % (Math.PI * 2);
}

/**
 * 두 점 사이의 거리 계산
 */
export function distance(pos1: Position, pos2: Position): number {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 화면 경계 체크
 */
export function isOffScreen(
  position: Position,
  canvasWidth: number,
  canvasHeight: number,
  margin: number = 50
): boolean {
  return (
    position.x < -margin ||
    position.x > canvasWidth + margin ||
    position.y < -margin ||
    position.y > canvasHeight + margin
  );
}
