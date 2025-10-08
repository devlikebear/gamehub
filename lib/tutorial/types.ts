/**
 * Tutorial tab types
 */
export type TutorialTab = 'overview' | 'controls' | 'rules' | 'tips';

/**
 * Control scheme (keyboard or touch)
 */
export interface ControlInfo {
  key: string; // Key name or icon
  action: string; // Action description
  actionKo: string; // Korean action description
}

/**
 * Tutorial content for a single game
 */
export interface GameTutorialContent {
  /** Game ID */
  gameId: string;

  /** Game title */
  title: string;
  titleKo: string;

  /** Overview (game description) */
  overview: string;
  overviewKo: string;

  /** Objective (win condition) */
  objective: string;
  objectiveKo: string;

  /** Keyboard controls */
  keyboardControls: ControlInfo[];

  /** Touch controls (for mobile) */
  touchControls: ControlInfo[];

  /** Game rules */
  rules: string[];
  rulesKo: string[];

  /** Tips & strategies */
  tips: string[];
  tipsKo: string[];

  /** Special features (unique mechanics) */
  specialFeatures?: string[];
  specialFeaturesKo?: string[];
}

/**
 * Tutorial settings storage
 */
export interface TutorialSettings {
  /** Game ID */
  gameId: string;

  /** Has seen tutorial */
  hasSeenTutorial: boolean;

  /** Don't show again */
  dontShowAgain: boolean;

  /** Last viewed timestamp */
  lastViewed: number;
}
