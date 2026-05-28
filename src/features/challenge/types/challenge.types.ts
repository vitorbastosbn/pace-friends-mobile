export type ChallengeStatus = 'ACTIVE' | 'AUDIT' | 'FINISHED' | 'DELETED' | 'COMPLETED' | 'CANCELLED';
export type CheckInStatus = 'VALID' | 'REMOVED_BY_CREATOR' | 'REMOVED_BY_LEAVE' | 'REMOVED_BY_DELETE';

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

// --- Challenges overview/detail screen contracts ---

export interface IndividualChallengeApiResponse {
  id: string;
  title: string;
  goal_distance_km: number;
  deadline: string;
  status: ChallengeStatus;
  progress_km: number;
  progress_percentage: number;
}

export interface IndividualChallenge {
  id: string;
  title: string;
  goalDistanceKm: number;
  deadline: string;
  status: ChallengeStatus;
  progressKm: number;
  progressPct: number;
}

export interface FriendChallengeApiResponse {
  id: string;
  title: string;
  status: ChallengeStatus;
  start_date: string;
  end_date: string;
  participant_count: number;
  max_participants: number;
  user_role: ParticipantRole;
  user_rank_position: number | null;
}

export interface FriendChallenge {
  id: string;
  title: string;
  status: ChallengeStatus;
  startDate: string;
  endDate: string;
  participantCount: number;
  maxParticipants: number;
  userRole: ParticipantRole;
  userRankPosition: number | null;
}

export interface ChallengeHistoryPageApiResponse {
  content: FriendChallengeApiResponse[];
  page: number;
  size: number;
  total_elements: number;
  has_next: boolean;
}

export interface ChallengeHistoryPage {
  items: FriendChallenge[];
  page: number;
  totalElements: number;
  hasNext: boolean;
}

export interface CheckInApiResponse {
  id: string;
  participant_name: string;
  distance_km: number;
  date: string;
  status: CheckInStatus;
}

export interface CheckIn {
  id: string;
  participantName: string;
  distanceKm: number;
  date: string;
  status: CheckInStatus;
}

export interface ChallengePermissionsApiResponse {
  can_check_in: boolean;
  can_leave: boolean;
  can_delete: boolean;
  can_reject_check_ins: boolean;
}

export interface ChallengePermissions {
  canCheckIn: boolean;
  canLeave: boolean;
  canDelete: boolean;
  canRejectCheckIns: boolean;
}

export interface ChallengeDetailApiResponse {
  id: string;
  title: string;
  description?: string;
  challenge_type: ChallengeType;
  goal_value?: number;
  start_date: string;
  end_date: string;
  invite_code: string;
  status: ChallengeStatus;
  participant_count: number;
  max_participants: number;
  user_role: ParticipantRole;
  ranking: RankingEntry[];
  check_ins: CheckInApiResponse[];
  permissions: ChallengePermissionsApiResponse;
}

export interface ChallengeDetail {
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
  userRole: ParticipantRole;
  ranking: RankingEntry[];
  checkIns: CheckIn[];
  permissions: ChallengePermissions;
}
