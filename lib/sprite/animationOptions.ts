/**
 * 스프라이트 타입별 애니메이션 옵션
 */

import type { SpriteType, AnimationType } from './types';

// 애니메이션 옵션 인터페이스
export interface AnimationOption {
  value: AnimationType;
  label: string;
  description: string; // 프롬프트용 상세 설명
}

// 캐릭터/적 애니메이션
const characterAnimations: AnimationOption[] = [
  { value: 'idle', label: '대기', description: 'idle/standing animation with subtle breathing or swaying motion' },
  { value: 'walk', label: '걷기', description: 'walking animation with alternating leg movement' },
  { value: 'run', label: '달리기', description: 'running animation with fast leg movement and forward lean' },
  { value: 'jump', label: '점프', description: 'jumping animation showing takeoff, mid-air, and landing' },
  { value: 'attack', label: '공격', description: 'attack animation with weapon swing or strike motion' },
  { value: 'death', label: '사망', description: 'death animation showing character falling or disappearing' },
  { value: 'hit', label: '피격', description: 'hit reaction animation showing damage taken' },
];

// 적 전용 추가 애니메이션
const enemyAnimations: AnimationOption[] = [
  ...characterAnimations,
  { value: 'fly', label: '비행', description: 'flying animation with wing flapping or hovering motion' },
  { value: 'swim', label: '수영', description: 'swimming animation with fluid underwater movement' },
];

// 아이템 애니메이션
const itemAnimations: AnimationOption[] = [
  { value: 'idle', label: '대기 (반짝임)', description: 'idle sparkle animation with glowing or twinkling effect' },
  { value: 'rotate', label: '회전', description: 'rotation animation spinning around vertical axis' },
  { value: 'bounce', label: '튕김', description: 'bouncing animation with up and down motion' },
  { value: 'float', label: '부유', description: 'floating animation with gentle up and down drift' },
  { value: 'collect', label: '수집됨', description: 'collection animation showing item being picked up and disappearing' },
  { value: 'spawn', label: '생성', description: 'spawn animation showing item appearing or materializing' },
];

// 이펙트 애니메이션
const effectAnimations: AnimationOption[] = [
  { value: 'explosion', label: '폭발', description: 'explosion animation with expanding burst and particles' },
  { value: 'sparkle', label: '반짝임', description: 'sparkle animation with twinkling star particles' },
  { value: 'smoke', label: '연기', description: 'smoke animation with rising and dissipating cloud' },
  { value: 'fire', label: '불', description: 'fire animation with flickering flames' },
  { value: 'water', label: '물', description: 'water splash animation with droplets' },
  { value: 'electric', label: '전기', description: 'electric shock animation with lightning bolts' },
  { value: 'magic', label: '마법', description: 'magic effect animation with glowing particles and swirls' },
  { value: 'appear', label: '등장', description: 'appear animation with fade-in or materialization effect' },
  { value: 'disappear', label: '사라짐', description: 'disappear animation with fade-out or dissipation effect' },
];

// UI 애니메이션
const uiAnimations: AnimationOption[] = [
  { value: 'pulse', label: '맥박', description: 'pulsing animation with scale breathing effect' },
  { value: 'glow', label: '빛남', description: 'glowing animation with brightness variation' },
  { value: 'shake', label: '흔들림', description: 'shake animation with small rapid movements' },
  { value: 'press', label: '눌림', description: 'button press animation with scale and color change' },
  { value: 'hover', label: '호버', description: 'hover animation with subtle lift and glow' },
];

// 배경 애니메이션
const backgroundAnimations: AnimationOption[] = [
  { value: 'scroll', label: '스크롤', description: 'scrolling animation with continuous horizontal or vertical movement' },
  { value: 'wave', label: '파도', description: 'wave animation with undulating water motion' },
  { value: 'wind', label: '바람', description: 'wind animation with swaying grass or trees' },
  { value: 'rain', label: '비', description: 'rain animation with falling droplets' },
  { value: 'snow', label: '눈', description: 'snow animation with falling snowflakes' },
];

// 커스텀 옵션
const customOption: AnimationOption = {
  value: 'custom',
  label: '커스텀 (직접 입력)',
  description: '',
};

/**
 * 스프라이트 타입에 따른 애니메이션 옵션 반환
 */
export function getAnimationOptions(spriteType: SpriteType): AnimationOption[] {
  const options: AnimationOption[] = [];

  switch (spriteType) {
    case 'character':
      options.push(...characterAnimations);
      break;
    case 'enemy':
      options.push(...enemyAnimations);
      break;
    case 'item':
      options.push(...itemAnimations);
      break;
    case 'effect':
      options.push(...effectAnimations);
      break;
    case 'ui':
      options.push(...uiAnimations);
      break;
    case 'background':
      options.push(...backgroundAnimations);
      break;
    default:
      options.push(...characterAnimations);
  }

  // 커스텀 옵션 추가
  options.push(customOption);

  return options;
}

/**
 * 애니메이션 설명 가져오기
 */
export function getAnimationDescription(animation: AnimationType, customDescription?: string): string {
  if (animation === 'custom' && customDescription) {
    return customDescription;
  }

  // 모든 애니메이션 옵션에서 검색
  const allOptions = [
    ...characterAnimations,
    ...enemyAnimations,
    ...itemAnimations,
    ...effectAnimations,
    ...uiAnimations,
    ...backgroundAnimations,
  ];

  const option = allOptions.find((opt) => opt.value === animation);
  return option?.description || `${animation} animation`;
}
