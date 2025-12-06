'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Users, AlertTriangle, Activity, Shield } from 'lucide-react';
import { dashboardStats, riskLevelConfig } from '@/lib/mock-data';

export function StatsCards() {
  const stats = [
    {
      title: '전체 학생',
      value: dashboardStats.totalStudents,
      unit: '명',
      icon: Users,
      color: 'bg-blue-500',
      change: '+2 이번 달',
    },
    {
      title: '정상 상태',
      value: dashboardStats.byRiskLevel.green,
      unit: '명',
      icon: Shield,
      color: 'bg-green-500',
      change: `${Math.round((dashboardStats.byRiskLevel.green / dashboardStats.totalStudents) * 100)}%`,
    },
    {
      title: '관심/주의 필요',
      value: dashboardStats.byRiskLevel.yellow + dashboardStats.byRiskLevel.orange,
      unit: '명',
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      change: '담임 관찰 권장',
    },
    {
      title: '오늘 분석 횟수',
      value: dashboardStats.analysisToday,
      unit: '회',
      icon: Activity,
      color: 'bg-violet-500',
      change: '실시간 모니터링',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                  <span className="text-lg text-slate-500">{stat.unit}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function RiskDistribution() {
  const total = dashboardStats.totalStudents;
  const levels = [
    { key: 'green' as const, count: dashboardStats.byRiskLevel.green },
    { key: 'yellow' as const, count: dashboardStats.byRiskLevel.yellow },
    { key: 'orange' as const, count: dashboardStats.byRiskLevel.orange },
    { key: 'red' as const, count: dashboardStats.byRiskLevel.red },
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4">위험도 분포</h3>

        {/* Progress bar */}
        <div className="h-4 rounded-full overflow-hidden flex mb-4">
          {levels.map((level) => {
            const percentage = (level.count / total) * 100;
            const bgColor = level.key === 'green' ? 'bg-green-500' :
                           level.key === 'yellow' ? 'bg-yellow-500' :
                           level.key === 'orange' ? 'bg-orange-500' : 'bg-red-500';
            return (
              <div
                key={level.key}
                className={`${bgColor} transition-all`}
                style={{ width: `${percentage}%` }}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3">
          {levels.map((level) => {
            const config = riskLevelConfig[level.key];
            const percentage = Math.round((level.count / total) * 100);
            return (
              <div key={level.key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  level.key === 'green' ? 'bg-green-500' :
                  level.key === 'yellow' ? 'bg-yellow-500' :
                  level.key === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-slate-600">
                  {config.label}: {level.count}명 ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
