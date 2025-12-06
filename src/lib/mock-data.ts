import { Student, StudentMonitoring, Alert, DashboardStats, ClassRoom, VoiceAnalysis, RiskLevel, EmotionType } from '@/types';

// 학생 목업 데이터
export const students: Student[] = [
  { id: '1', name: '김민준', age: 6, grade: '7세반', classRoom: '햇살반', enrolledDate: '2024-03-02', parentContact: '010-1234-5678' },
  { id: '2', name: '이서연', age: 6, grade: '7세반', classRoom: '햇살반', enrolledDate: '2024-03-02', parentContact: '010-2345-6789' },
  { id: '3', name: '박지호', age: 5, grade: '6세반', classRoom: '달빛반', enrolledDate: '2024-03-02', parentContact: '010-3456-7890' },
  { id: '4', name: '최수아', age: 5, grade: '6세반', classRoom: '달빛반', enrolledDate: '2024-03-02', parentContact: '010-4567-8901' },
  { id: '5', name: '정예준', age: 6, grade: '7세반', classRoom: '햇살반', enrolledDate: '2024-03-02', parentContact: '010-5678-9012' },
  { id: '6', name: '강하은', age: 4, grade: '5세반', classRoom: '별빛반', enrolledDate: '2024-03-02', parentContact: '010-6789-0123' },
  { id: '7', name: '윤도윤', age: 5, grade: '6세반', classRoom: '달빛반', enrolledDate: '2024-03-02', parentContact: '010-7890-1234' },
  { id: '8', name: '임시우', age: 6, grade: '7세반', classRoom: '햇살반', enrolledDate: '2024-03-02', parentContact: '010-8901-2345' },
  { id: '9', name: '한소율', age: 4, grade: '5세반', classRoom: '별빛반', enrolledDate: '2024-03-02', parentContact: '010-9012-3456' },
  { id: '10', name: '오지안', age: 5, grade: '6세반', classRoom: '달빛반', enrolledDate: '2024-03-02', parentContact: '010-0123-4567' },
  { id: '11', name: '장서준', age: 6, grade: '7세반', classRoom: '햇살반', enrolledDate: '2024-03-02', parentContact: '010-1111-2222' },
  { id: '12', name: '송하린', age: 4, grade: '5세반', classRoom: '별빛반', enrolledDate: '2024-03-02', parentContact: '010-3333-4444' },
];

// 위험도별 색상
export const riskLevelConfig: Record<RiskLevel, { label: string; color: string; bgColor: string; borderColor: string; description: string }> = {
  green: {
    label: '정상',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-500',
    description: '일상적 범위 내 - 모니터링 지속'
  },
  yellow: {
    label: '관심',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-500',
    description: '경미한 변화 감지 - 담임교사 관심 필요'
  },
  orange: {
    label: '주의',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-500',
    description: '지속적 이상 패턴 - 전문 상담사 연계 권장'
  },
  red: {
    label: '위험',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-500',
    description: '급격한 변화/위험 징후 - 즉각 개입 필요'
  },
};

// 감정 타입 설정
export const emotionConfig: Record<EmotionType, { label: string; emoji: string; color: string }> = {
  happy: { label: '행복', emoji: '😊', color: 'text-green-500' },
  neutral: { label: '평온', emoji: '😐', color: 'text-gray-500' },
  sad: { label: '슬픔', emoji: '😢', color: 'text-blue-500' },
  anxious: { label: '불안', emoji: '😰', color: 'text-yellow-500' },
  angry: { label: '분노', emoji: '😠', color: 'text-red-500' },
  fearful: { label: '두려움', emoji: '😨', color: 'text-purple-500' },
};

// 주간 트렌드 생성
function generateWeeklyTrend(baseScore: number): { date: string; riskScore: number }[] {
  const trend = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const variation = Math.random() * 20 - 10;
    trend.push({
      date: date.toISOString().split('T')[0],
      riskScore: Math.max(0, Math.min(100, baseScore + variation)),
    });
  }
  return trend;
}

// 학생 모니터링 데이터 생성
export function generateStudentMonitoring(): StudentMonitoring[] {
  const riskDistribution: RiskLevel[] = ['green', 'green', 'green', 'green', 'green', 'green', 'yellow', 'yellow', 'orange', 'red', 'green', 'yellow'];

  return students.map((student, index) => {
    const riskLevel = riskDistribution[index] || 'green';
    const baseScore = riskLevel === 'green' ? 15 : riskLevel === 'yellow' ? 40 : riskLevel === 'orange' ? 65 : 85;

    return {
      student,
      currentRiskLevel: riskLevel,
      lastAnalysis: generateVoiceAnalysis(student.id, riskLevel),
      weeklyTrend: generateWeeklyTrend(baseScore),
      baselineDeviation: riskLevel === 'green' ? Math.random() * 10 :
                         riskLevel === 'yellow' ? 15 + Math.random() * 15 :
                         riskLevel === 'orange' ? 30 + Math.random() * 20 :
                         50 + Math.random() * 30,
      alertCount: riskLevel === 'green' ? 0 : riskLevel === 'yellow' ? 1 : riskLevel === 'orange' ? 3 : 5,
      lastUpdated: new Date().toISOString(),
    };
  });
}

// 음성 분석 결과 생성
export function generateVoiceAnalysis(studentId: string, riskLevel: RiskLevel): VoiceAnalysis {
  const emotionByRisk: Record<RiskLevel, EmotionType> = {
    green: 'happy',
    yellow: 'anxious',
    orange: 'sad',
    red: 'fearful',
  };

  const riskScoreRange: Record<RiskLevel, [number, number]> = {
    green: [0, 25],
    yellow: [26, 50],
    orange: [51, 75],
    red: [76, 100],
  };

  const [min, max] = riskScoreRange[riskLevel];
  const riskScore = min + Math.random() * (max - min);

  return {
    id: `analysis-${Date.now()}-${studentId}`,
    studentId,
    timestamp: new Date().toISOString(),
    duration: 30 + Math.random() * 90,
    pitch: {
      average: 200 + Math.random() * 100,
      variance: riskLevel === 'green' ? 10 + Math.random() * 10 : 25 + Math.random() * 25,
      trend: riskLevel === 'green' ? 'stable' : riskLevel === 'red' ? 'increasing' : 'decreasing',
    },
    speed: {
      wordsPerMinute: 80 + Math.random() * 60,
      trend: riskLevel === 'green' ? 'normal' : riskLevel === 'yellow' ? 'slow' : 'fast',
    },
    tone: {
      primary: emotionByRisk[riskLevel],
      confidence: 70 + Math.random() * 25,
      secondary: riskLevel !== 'green' ? 'neutral' : undefined,
    },
    tremor: {
      detected: riskLevel === 'orange' || riskLevel === 'red',
      intensity: riskLevel === 'green' ? 5 : riskLevel === 'yellow' ? 20 : riskLevel === 'orange' ? 45 : 70,
    },
    silencePattern: {
      totalSilence: riskLevel === 'green' ? 5 : riskLevel === 'yellow' ? 12 : 20,
      unusualPauses: riskLevel === 'green' ? 0 : riskLevel === 'yellow' ? 2 : riskLevel === 'orange' ? 5 : 8,
    },
    riskScore,
    riskLevel,
  };
}

// 알림 목업 데이터
export const alerts: Alert[] = [
  {
    id: 'alert-1',
    studentId: '10',
    studentName: '오지안',
    type: 'risk_elevated',
    riskLevel: 'red',
    message: '급격한 음성 패턴 변화 감지. 지난 3일간 위험 점수 40% 상승.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isRead: false,
  },
  {
    id: 'alert-2',
    studentId: '9',
    studentName: '한소율',
    type: 'pattern_change',
    riskLevel: 'orange',
    message: '지속적인 불안 징후 패턴 감지. 전문 상담사 연계 권장.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isRead: false,
  },
  {
    id: 'alert-3',
    studentId: '7',
    studentName: '윤도윤',
    type: 'intervention_needed',
    riskLevel: 'yellow',
    message: '경미한 정서 변화 감지. 담임교사 관찰 권장.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isRead: true,
  },
  {
    id: 'alert-4',
    studentId: '8',
    studentName: '임시우',
    type: 'follow_up',
    riskLevel: 'yellow',
    message: '이전 상담 후 추적 관찰 필요. 음성 패턴 개선 중.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: true,
  },
];

// 대시보드 통계
export const dashboardStats: DashboardStats = {
  totalStudents: 12,
  byRiskLevel: {
    green: 7,
    yellow: 3,
    orange: 1,
    red: 1,
  },
  alertsToday: 4,
  analysisToday: 48,
  weeklyTrend: [
    { date: '2024-12-01', green: 8, yellow: 2, orange: 1, red: 1 },
    { date: '2024-12-02', green: 7, yellow: 3, orange: 1, red: 1 },
    { date: '2024-12-03', green: 8, yellow: 2, orange: 2, red: 0 },
    { date: '2024-12-04', green: 7, yellow: 3, orange: 1, red: 1 },
    { date: '2024-12-05', green: 6, yellow: 4, orange: 1, red: 1 },
    { date: '2024-12-06', green: 7, yellow: 3, orange: 1, red: 1 },
  ],
};

// 반 정보
export const classRooms: ClassRoom[] = [
  { id: 'class-1', name: '햇살반', teacher: '김선생님', studentCount: 5, averageRiskScore: 22 },
  { id: 'class-2', name: '달빛반', teacher: '이선생님', studentCount: 4, averageRiskScore: 35 },
  { id: 'class-3', name: '별빛반', teacher: '박선생님', studentCount: 3, averageRiskScore: 28 },
];
