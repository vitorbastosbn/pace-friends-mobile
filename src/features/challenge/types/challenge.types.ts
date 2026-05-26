export type ChallengeStatus = 'ACTIVE' | 'AUDIT' | 'FINISHED' | 'DELETED' | 'COMPLETED' | 'CANCELLED';
export type CheckInStatus = 'VALID' | 'REJECTED' | 'REMOVED_BY_LEAVE' | 'REMOVED_BY_DELETE';

export interface ChallengeResponse {
  id: string;
  title: string;
  goalDistanceKm: number;
  deadline: string;
  status: ChallengeStatus;
  createdAt: string;
}

export interface ChallengeProgressResponse {
  id: string;
  title: string;
  goalDistanceKm: number;
  deadline: string;
  status: ChallengeStatus;
  progressKm: number;
  progressPct: number;
  createdAt: string;
  activities?: ActivityResponse[];
}

export interface ActivityResponse {
  id: string;
  challengeId: string;
  distanceKm: number;
  durationSeconds: number;
  paceSecondsPerKm: number;
  activityDate: string;
  notes?: string;
  createdAt: string;
}

export interface CreateChallengeRequest {
  title: string;
  goalDistanceKm: number;
  deadline: string;
}

export interface RegisterActivityRequest {
  distanceKm: number;
  durationSeconds: number;
  activityDate: string;
  notes?: string;
}

// --- FriendChallenge types ---

export type ChallengeType = 'DISTANCE' | 'ACTIVITY_TIME' | 'PACE' | 'CHECK_IN';
export type ParticipantRole = 'CREATOR' | 'MEMBER';

export interface ParticipantResponse {
  userId: string;
  name: string;
  role: ParticipantRole;
  joinedAt: string;
}

export interface FriendChallengeResponse {
  id: string;
  title: string;
  description?: string;
  challengeType: ChallengeType;
  goalValue?: number;
  startDate: string;
  endDate: string;
  inviteCode: string;
  status: ChallengeStatus;
  participantCount: number;
  maxParticipants: number;
  myRole: ParticipantRole;
  createdAt: string;
  participants?: ParticipantResponse[];
}

export interface CreateFriendChallengeRequest {
  title: string;
  description?: string;
  challengeType: ChallengeType;
  goalValue?: number;
  startDate: string;
  endDate: string;
}

export interface CheckInResponse {
  id: string;
  challengeId: string;
  userId: string;
  distanceKm: number;
  durationSeconds: number;
  paceSecondsPerKm: number;
  checkInDate: string;
  notes?: string;
  status: CheckInStatus;
  createdAt: string;
}

export interface CheckInWithUserNameResponse extends CheckInResponse {
  userName: string;
}

export interface RegisterCheckInRequest {
  distanceKm: number;
  durationSeconds: number;
  checkInDate: string;
  notes?: string;
}

export interface RankingEntry {
  position: number;
  userId: string;
  name: string;
  score: number;
  checkInCount: number;
}

export interface RankingResponse {
  challengeType: ChallengeType;
  entries: RankingEntry[];
}
