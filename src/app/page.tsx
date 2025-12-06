'use client';

import { DashboardLayout } from '@/components/layout';
import { StatsCards, RiskDistribution } from '@/components/dashboard/stats-cards';
import { RecentAlerts } from '@/components/dashboard/recent-alerts';
import { StudentQuickList } from '@/components/dashboard/student-list';
import { WeeklyTrendChart } from '@/components/dashboard/weekly-chart';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Award, Calendar, Shield, Heart } from 'lucide-react';

export default function DashboardPage() {
  return (
    <DashboardLayout title="대시보드" subtitle="아동 음성 감정 분석 현황">
      <div className="space-y-6">
        {/* Hero Section with Contest Badge */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 md:p-8 text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl" />
          </div>

          {/* Floating Icons */}
          <div className="absolute top-4 right-4 opacity-20">
            <Heart className="w-24 h-24" />
          </div>

          <div className="relative z-10">
            {/* Contest Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-4">
              <Award className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium">2025 공모전 출품작</span>
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>

            {/* Main Title */}
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              AI와 함께하는 365일
            </h1>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text">
              아동이 행복한 세상
            </h2>

            {/* Description */}
            <p className="text-white/80 max-w-2xl mb-6 text-sm md:text-base">
              아이보이스(AiVoice)는 AI 음성 감정 분석 기술을 통해 아동의 정서적 위기를 조기에 감지하고,
              적시에 전문가 개입을 연계하는 <strong className="text-white">사전 예방형 아동 보호 시스템</strong>입니다.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                비침습적 모니터링
              </Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                365일 상시 분석
              </Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI 감정 인식
              </Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 gap-1.5">
                <Heart className="w-3.5 h-3.5" />
                아동권리 증진
              </Badge>
            </div>

            {/* Organizer Info */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <p className="text-xs text-white/60">
                주최: 아동권리보장원 | 후원: 보건복지부
              </p>
            </div>
          </div>
        </div>

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
