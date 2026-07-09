export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  participants: string[];
  startedAt: string;
  endedAt?: string;
  status: 'active' | 'ended' | 'reported';
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  sessionId: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface ModerationFlag {
  id: string;
  sessionId: string;
  type: 'nudity' | 'violence' | 'harassment' | 'spam' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  timestamp: string;
}

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}
