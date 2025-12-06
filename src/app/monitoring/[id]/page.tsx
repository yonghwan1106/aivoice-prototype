'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  students,
  generateStudentMonitoring,
  riskLevelConfig,
  emotionConfig,
  alerts,
} from '@/lib/mock-data';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Volume2,
  Brain,
  AlertTriangle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id as string;

  const student = students.find((s) => s.id === studentId);
  const monitoring = useMemo(() => generateStudentMonitoring(), []);
  const studentMonitoring = monitoring.find((m) => m.student.id === studentId);
  const studentAlerts = alerts.filter((a) => a.studentId === studentId);

  if (!student || !studentMonitoring) {
    return (
      <DashboardLayout title="학생 정보 없음" subtitle="">
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-slate-500 mb-4">학생 정보를 찾을 수 없습니다.</p>
          <Link href="/monitoring">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로 돌아가기
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const config = riskLevelConfig[studentMonitoring.currentRiskLevel];
  const lastAnalysis = studentMonitoring.lastAnalysis;

  // 차트 데이터
  const trendData = studentMonitoring.weeklyTrend.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
  }));

  // 레이더 차트 데이터
  const radarData = lastAnalysis
    ? [
        { subject: '피치 변화', value: lastAnalysis.pitch.variance, fullMark: 50 },
        { subject: '말 속도', value: (lastAnalysis.speed.wordsPerMinute - 80) / 2, fullMark: 50 },
        { subject: '음성 떨림', value: lastAnalysis.tremor.intensity, fullMark: 100 },
        { subject: '침묵 빈도', value: lastAnalysis.silencePattern.unusualPauses * 10, fullMark: 100 },
        { subject: '감정 강도', value: 100 - lastAnalysis.tone.confidence, fullMark: 100 },
      ]
    : [];

  return (
    <DashboardLayout
      title={`${student.name} 상세 정보`}
      subtitle={`${student.classRoom} · ${student.grade}`}
    >
      <div className="space-y-6">
        {/* 뒤로가기 */}
        <Link href="/monitoring">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로
          </Button>
        </Link>

        {/* 학생 정보 헤더 */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold ${
                    studentMonitoring.currentRiskLevel === 'green'
                      ? 'bg-green-500'
                      : studentMonitoring.currentRiskLevel === 'yellow'
                      ? 'bg-yellow-500'
                      : studentMonitoring.currentRiskLevel === 'orange'
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                  }`}
                >
                  {student.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-900">{student.name}</h2>
                    <Badge className={`${config.bgColor} ${config.color} border-0`}>
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-slate-500 mt-1">
                    {student.age}세 · {student.classRoom} · {student.grade}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      입학일: {student.enrolledDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {student.parentContact}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  상담 기록
                </Button>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  리포트
                </Button>
                <Button>
                  <Phone className="w-4 h-4 mr-2" />
                  보호자 연락
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 탭 콘텐츠 */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="analysis">분석 상세</TabsTrigger>
            <TabsTrigger value="history">히스토리</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* 요약 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">위험 점수</p>
                      <p className="text-2xl font-bold">
                        {Math.round(studentMonitoring.weeklyTrend[studentMonitoring.weeklyTrend.length - 1]?.riskScore || 0)}
                      </p>
                    </div>
                    <Activity className="w-8 h-8 text-violet-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">기준선 대비</p>
                      <p className={`text-2xl font-bold ${
                        studentMonitoring.baselineDeviation > 30 ? 'text-red-600' :
                        studentMonitoring.baselineDeviation > 15 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        +{studentMonitoring.baselineDeviation.toFixed(1)}%
                      </p>
                    </div>
                    {studentMonitoring.baselineDeviation > 15 ? (
                      <TrendingUp className="w-8 h-8 text-red-500" />
                    ) : (
                      <Minus className="w-8 h-8 text-green-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">알림 횟수</p>
                      <p className="text-2xl font-bold">{studentMonitoring.alertCount}</p>
                    </div>
                    <AlertTriangle className={`w-8 h-8 ${
                      studentMonitoring.alertCount > 3 ? 'text-red-500' :
                      studentMonitoring.alertCount > 0 ? 'text-yellow-500' : 'text-green-500'
                    }`} />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">주요 감정</p>
                      <p className="text-2xl font-bold">
                        {lastAnalysis ? emotionConfig[lastAnalysis.tone.primary].emoji : '-'}
                      </p>
                    </div>
                    <Brain className="w-8 h-8 text-violet-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 차트 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">주간 위험도 추이</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="riskScore"
                          name="위험 점수"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          dot={{ fill: '#8b5cf6' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">음성 지표 분석</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar
                          name="현재"
                          dataKey="value"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.5}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 최근 알림 */}
            {studentAlerts.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">최근 알림</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentAlerts.slice(0, 3).map((alert) => {
                      const alertConfig = riskLevelConfig[alert.riskLevel];
                      return (
                        <div
                          key={alert.id}
                          className={`p-3 rounded-lg ${alertConfig.bgColor} border-l-4 ${alertConfig.borderColor}`}
                        >
                          <div className="flex items-center gap-2">
                            <AlertTriangle className={`w-4 h-4 ${alertConfig.color}`} />
                            <span className="font-medium">{alert.message}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6 mt-6">
            {lastAnalysis && (
              <>
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-violet-600" />
                      마지막 음성 분석 결과
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-500">피치 평균</p>
                        <p className="text-xl font-bold">{Math.round(lastAnalysis.pitch.average)} Hz</p>
                        <p className="text-xs text-slate-400 mt-1">
                          변화: {lastAnalysis.pitch.trend === 'stable' ? '안정' : lastAnalysis.pitch.trend === 'increasing' ? '상승' : '하락'}
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-500">말 속도</p>
                        <p className="text-xl font-bold">{Math.round(lastAnalysis.speed.wordsPerMinute)} WPM</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {lastAnalysis.speed.trend === 'normal' ? '정상' : lastAnalysis.speed.trend === 'fast' ? '빠름' : '느림'}
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-500">음성 떨림</p>
                        <p className="text-xl font-bold">{lastAnalysis.tremor.detected ? '감지됨' : '없음'}</p>
                        <Progress value={lastAnalysis.tremor.intensity} className="h-2 mt-2" />
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-500">감정 상태</p>
                        <p className="text-xl font-bold flex items-center gap-2">
                          {emotionConfig[lastAnalysis.tone.primary].emoji}
                          {emotionConfig[lastAnalysis.tone.primary].label}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          신뢰도: {Math.round(lastAnalysis.tone.confidence)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">분석 히스토리 기능은 준비 중입니다.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
