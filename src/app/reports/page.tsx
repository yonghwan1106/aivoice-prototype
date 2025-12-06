'use client';

import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboardStats, classRooms, riskLevelConfig } from '@/lib/mock-data';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import {
  Download,
  FileText,
  TrendingUp,
  Users,
  Calendar,
  Clock,
} from 'lucide-react';

export default function ReportsPage() {
  // 반별 통계 데이터
  const classStats = classRooms.map((room) => ({
    name: room.name,
    students: room.studentCount,
    avgRisk: room.averageRiskScore,
  }));

  // 위험도 분포 파이 차트 데이터
  const riskPieData = [
    { name: '정상', value: dashboardStats.byRiskLevel.green, color: '#22c55e' },
    { name: '관심', value: dashboardStats.byRiskLevel.yellow, color: '#eab308' },
    { name: '주의', value: dashboardStats.byRiskLevel.orange, color: '#f97316' },
    { name: '위험', value: dashboardStats.byRiskLevel.red, color: '#ef4444' },
  ];

  // 주간 트렌드 데이터
  const weeklyData = dashboardStats.weeklyTrend.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('ko-KR', { weekday: 'short' }),
    total: item.green + item.yellow + item.orange + item.red,
    riskRate: Math.round(((item.yellow + item.orange + item.red) / (item.green + item.yellow + item.orange + item.red)) * 100),
  }));

  // 월간 분석 통계 (목업)
  const monthlyStats = [
    { month: '8월', analyses: 320, alerts: 15 },
    { month: '9월', analyses: 380, alerts: 22 },
    { month: '10월', analyses: 420, alerts: 18 },
    { month: '11월', analyses: 450, alerts: 25 },
    { month: '12월', analyses: 280, alerts: 12 },
  ];

  return (
    <DashboardLayout title="통계 및 리포트" subtitle="전체 현황 분석 및 리포트 생성">
      <div className="space-y-6">
        {/* 요약 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <Users className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">전체 학생</p>
                  <p className="text-xl font-bold">{dashboardStats.totalStudents}명</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">정상 비율</p>
                  <p className="text-xl font-bold">
                    {Math.round((dashboardStats.byRiskLevel.green / dashboardStats.totalStudents) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">오늘 분석</p>
                  <p className="text-xl font-bold">{dashboardStats.analysisToday}회</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">오늘 알림</p>
                  <p className="text-xl font-bold">{dashboardStats.alertsToday}건</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 차트 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 위험도 분포 파이 차트 */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">위험도 분포</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {riskPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 반별 현황 */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">반별 평균 위험도</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="avgRisk" name="평균 위험도" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 주간 추이 */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">주간 관심 필요 학생 비율</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => [`${value}%`, '관심 필요 비율']} />
                    <Line
                      type="monotone"
                      dataKey="riskRate"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={{ fill: '#f97316' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 월간 분석 추이 */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">월간 분석/알림 추이</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="analyses" name="분석 횟수" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="alerts" name="알림 발생" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 리포트 다운로드 */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">리포트 생성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <FileText className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-medium">주간 리포트</p>
                    <p className="text-sm text-slate-500">최근 7일 분석 요약</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  PDF 다운로드
                </Button>
              </div>
              <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">월간 리포트</p>
                    <p className="text-sm text-slate-500">이번 달 종합 분석</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  PDF 다운로드
                </Button>
              </div>
              <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">학생별 리포트</p>
                    <p className="text-sm text-slate-500">개별 학생 상세 분석</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  학생 선택
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
