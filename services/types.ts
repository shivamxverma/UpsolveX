export interface WebSocketMessage {
  type: string;
  message?: string;
  userId?: string;
  members?: number;
  isAdmin?: boolean;
  creator?: string;
  submissionDeadline?: number;
  votingDeadline?: number;
  submissions?: { userId: string; submission: string }[];
  results?: { userId: string; submission: string; score: number; votesReceived: number }[];
  history?: ContestHistory[];
  targetUserId?: string;
  score?: number;
  by?: string;
}

export interface Contest {
  creator: string;
  startedAt: number;
  submissions: { userId: string; submission: string; timestamp: number }[];
  votes: { userId: string; votes: { userId: string; score: number }[] }[];
  status: 'submission' | 'voting' | 'ended';
  submissionDeadline: number;
  votingDeadline?: number;
  votingDuration: number;
}

export interface ContestHistory {
  endedAt: number;
  creator: string;
  results: { userId: string; submission: string; score: number; votesReceived: number }[];
  totalParticipants: number;
}

export interface Member {
  userId: string;
  isAdmin: boolean;
}