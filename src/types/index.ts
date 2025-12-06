// 학생 정보 타입
export interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  classRoom: string;
  profileImage?: string;
  enrolledDate: string;
  parentContact: string;
}

// 위험도 레벨
export type RiskLevel = 'green' | 'yellow' | 'orange' | 'red';

// 감정 상태
export type EmotionType = 'happy' | 'neutral' | 'sad' | 'anxious' | 'angry' | 'fearful';

// 음성 분석 결과
export interface VoiceAnalysis {
  id: string;
  studentId: string;
  timestamp: string;
  duration: number; // 초 단위
  pitch: {
    average: number;
    variance: number;
    trend: 'stable' | 'increasing' | 'decreasing';
  };
  speed: {
    wordsPerMinute: number;
    trend: 'normal' | 'fast' | 'slow';
  };
  tone: {
    primary: EmotionType;
    confidence: number; // 0-100
    secondary?: EmotionType;
  };
  tremor: {
    detected: boolean;
    intensity: number; // 0-100
  };
  silencePattern: {
    totalSilence: number; // 초
    unusualPauses: number;
  };
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
}

// 학생 모니터링 상태
export interface StudentMonitoring {
  student: Student;
  currentRiskLevel: RiskLevel;
  lastAnalysis?: VoiceAnalysis;
  weeklyTrend: {
    date: string;
    riskScore: number;
  }[];
  baselineDeviation: number; // 기준선 대비 변화율 (%)
  alertCount: number;
  lastUpdated: string;
}

// 알림 타입
export type AlertType = 'risk_elevated' | 'pattern_change' | 'intervention_needed' | 'follow_up';

// 알림
export interface Alert {
  id: string;
  studentId: string;
  studentName: string;
  type: AlertType;
  riskLevel: RiskLevel;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionTaken?: string;
}

// 대시보드 통계
export interface DashboardStats {
  totalStudents: number;
  byRiskLevel: {
    green: number;
    yellow: number;
    orange: number;
    red: number;
  };
  alertsToday: number;
  analysisToday: number;
  weeklyTrend: {
    date: string;
    green: number;
    yellow: number;
    orange: number;
    red: number;
  }[];
}

// 클래스 정보
export interface ClassRoom {
  id: string;
  name: string;
  teacher: string;
  studentCount: number;
  averageRiskScore: number;
}
