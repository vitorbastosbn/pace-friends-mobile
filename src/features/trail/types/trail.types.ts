export type ItemStatus = 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED';

export interface TrailItem {
  position: number;
  description: string;
  xpReward: number;
  status: ItemStatus;
  completedAt: string | null;
}

export interface TrainingPath {
  level: number;
  completedItems: number;
  totalItems: number;
  completedAt: string | null;
  bonusXpAwarded: boolean;
  items: TrailItem[];
}

export interface NextLevelRequirements {
  pathCompleted: boolean;
  streakWeeksRequired: number;
  streakWeeksCompleted: number;
  xpRequired: number;
  xpCurrent: number;
}

export interface TrainingPathData {
  userId: string;
  currentLevel: number;
  currentLevelName: string;
  path: TrainingPath;
  canLevelUp: boolean;
  nextLevelRequirements: NextLevelRequirements;
}

export interface LevelUpResult {
  previousLevel: number;
  newLevel: number;
  newLevelName: string;
}
