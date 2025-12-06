'use client';

import { DashboardLayout } from '@/components/layout';
import { StatsCards, RiskDistribution } from '@/components/dashboard/stats-cards';
import { RecentAlerts } from '@/components/dashboard/recent-alerts';
import { StudentQuickList } from '@/components/dashboard/student-list';
import { WeeklyTrendChart } from '@/components/dashboard/weekly-chart';

export default function DashboardPage() {
  return (
    <DashboardLayout title="대시보드" subtitle="아동 음성 감정 분석 현황">
      <div className="space-y-6">
        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chart & Distribution */}
          <div className="lg:col-span-2 space-y-6">
            <WeeklyTrendChart />
            <RiskDistribution />
          </div>

          {/* Right Column - Alerts & Students */}
          <div className="space-y-6">
            <RecentAlerts />
            <StudentQuickList />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
