'use client';

import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Bell,
  Shield,
  Users,
  Volume2,
  Mail,
  Phone,
  Building,
  Save,
  AlertTriangle,
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <DashboardLayout title="설정" subtitle="시스템 및 알림 설정">
      <div className="space-y-6 max-w-4xl">
        {/* 기관 정보 */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-violet-600" />
              기관 정보
            </CardTitle>
            <CardDescription>기관 기본 정보를 관리합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">기관명</label>
                <Input defaultValue="햇살어린이집" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">기관 코드</label>
                <Input defaultValue="KDG-2024-001" disabled />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">대표 연락처</label>
                <Input defaultValue="02-1234-5678" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">이메일</label>
                <Input defaultValue="admin@sunshine-kindergarten.kr" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 알림 설정 */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-violet-600" />
              알림 설정
            </CardTitle>
            <CardDescription>위험도별 알림 수신 설정을 관리합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-slate-900">위험 (Red) 알림</p>
                    <p className="text-sm text-slate-500">즉각 개입 필요 시 알림</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-700">즉시 알림</Badge>
                  <Badge variant="outline">SMS</Badge>
                  <Badge variant="outline">이메일</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-slate-900">주의 (Orange) 알림</p>
                    <p className="text-sm text-slate-500">전문가 상담 권장 시 알림</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-100 text-orange-700">30분 내</Badge>
                  <Badge variant="outline">이메일</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-slate-900">관심 (Yellow) 알림</p>
                    <p className="text-sm text-slate-500">담임 관찰 필요 시 알림</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-100 text-yellow-700">일일 요약</Badge>
                  <Badge variant="outline">대시보드</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 음성 분석 설정 */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-violet-600" />
              음성 분석 설정
            </CardTitle>
            <CardDescription>AI 음성 분석 파라미터를 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">
                  분석 주기
                </label>
                <Input defaultValue="매일 오전 10시, 오후 2시" disabled />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">
                  최소 녹음 시간
                </label>
                <Input defaultValue="30초" disabled />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">
                  기준선 학습 기간
                </label>
                <Input defaultValue="2주" disabled />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">
                  이상 감지 임계값
                </label>
                <Input defaultValue="표준편차 2.0" disabled />
              </div>
            </div>
            <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
              ⚠️ 음성 분석 설정은 관리자만 변경할 수 있습니다. 변경이 필요한 경우 시스템 관리자에게 문의하세요.
            </p>
          </CardContent>
        </Card>

        {/* 연계 기관 */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-violet-600" />
              연계 기관
            </CardTitle>
            <CardDescription>긴급 상황 시 연계되는 기관 정보입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">서울시 아동보호전문기관</p>
                  <p className="text-sm text-slate-500">위험(Red) 단계 자동 연계</p>
                </div>
                <Badge className="bg-green-100 text-green-700">연결됨</Badge>
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">아동권리보장원</p>
                  <p className="text-sm text-slate-500">데이터 통합 연동</p>
                </div>
                <Badge className="bg-green-100 text-green-700">연결됨</Badge>
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">정신건강복지센터</p>
                  <p className="text-sm text-slate-500">전문 상담 연계</p>
                </div>
                <Badge className="bg-green-100 text-green-700">연결됨</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 저장 버튼 */}
        <div className="flex justify-end">
          <Button>
            <Save className="w-4 h-4 mr-2" />
            설정 저장
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
