'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { alerts as initialAlerts, riskLevelConfig, students } from '@/lib/mock-data';
import { Alert, RiskLevel } from '@/types';
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle,
  Phone,
  FileText,
  MessageSquare,
  Eye,
  Filter,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filterUnread, setFilterUnread] = useState(false);

  const markAsRead = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })));
  };

  const unreadCount = alerts.filter((a) => !a.isRead).length;
  const filteredAlerts = filterUnread ? alerts.filter((a) => !a.isRead) : alerts;

  const getAlertTypeLabel = (type: Alert['type']) => {
    switch (type) {
      case 'risk_elevated':
        return '위험도 상승';
      case 'pattern_change':
        return '패턴 변화';
      case 'intervention_needed':
        return '개입 필요';
      case 'follow_up':
        return '추적 관찰';
      default:
        return type;
    }
  };

  return (
    <DashboardLayout title="알림 센터" subtitle="아동 위험 알림 및 조치 관리">
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-2 bg-red-100 rounded-lg">
              <Bell className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-600">{unreadCount}개 미확인</span>
            </div>
            <Button
              variant={filterUnread ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterUnread(!filterUnread)}
            >
              <Filter className="w-4 h-4 mr-2" />
              미확인만 보기
            </Button>
          </div>
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle className="w-4 h-4 mr-2" />
            모두 읽음 처리
          </Button>
        </div>

        {/* 알림 목록 */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="py-12 text-center">
                <Bell className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">표시할 알림이 없습니다</p>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert) => {
              const config = riskLevelConfig[alert.riskLevel];
              const student = students.find((s) => s.id === alert.studentId);

              return (
                <Card
                  key={alert.id}
                  className={`border-0 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                    !alert.isRead ? 'ring-2 ring-violet-200' : ''
                  }`}
                  onClick={() => {
                    setSelectedAlert(alert);
                    markAsRead(alert.id);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* 위험도 아이콘 */}
                      <div
                        className={`p-3 rounded-xl ${
                          alert.riskLevel === 'red'
                            ? 'bg-red-100'
                            : alert.riskLevel === 'orange'
                            ? 'bg-orange-100'
                            : 'bg-yellow-100'
                        }`}
                      >
                        <AlertTriangle
                          className={`w-6 h-6 ${config.color} ${
                            alert.riskLevel === 'red' ? 'animate-pulse' : ''
                          }`}
                        />
                      </div>

                      {/* 알림 내용 */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-900">
                            {alert.studentName}
                          </span>
                          <Badge
                            className={`${config.bgColor} ${config.color} border-0`}
                          >
                            {config.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getAlertTypeLabel(alert.type)}
                          </Badge>
                          {!alert.isRead && (
                            <span className="w-2 h-2 rounded-full bg-violet-500" />
                          )}
                        </div>

                        <p className="text-slate-600 mt-1">{alert.message}</p>

                        <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDistanceToNow(new Date(alert.timestamp), {
                              addSuffix: true,
                              locale: ko,
                            })}
                          </div>
                          {student && (
                            <span>
                              {student.classRoom} · {student.grade}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 빠른 액션 */}
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" title="상세 보기">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="연락하기">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* 알림 상세 다이얼로그 */}
        <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
          {selectedAlert && (
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle
                    className={`w-5 h-5 ${
                      riskLevelConfig[selectedAlert.riskLevel].color
                    }`}
                  />
                  {selectedAlert.studentName} - {getAlertTypeLabel(selectedAlert.type)}
                </DialogTitle>
                <DialogDescription>
                  {format(new Date(selectedAlert.timestamp), 'yyyy년 M월 d일 HH:mm', {
                    locale: ko,
                  })}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* 위험도 */}
                <div
                  className={`p-4 rounded-lg ${
                    riskLevelConfig[selectedAlert.riskLevel].bgColor
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">위험도</span>
                    <Badge
                      className={`${riskLevelConfig[selectedAlert.riskLevel].bgColor} ${
                        riskLevelConfig[selectedAlert.riskLevel].color
                      } border-0`}
                    >
                      {riskLevelConfig[selectedAlert.riskLevel].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    {riskLevelConfig[selectedAlert.riskLevel].description}
                  </p>
                </div>

                {/* 알림 메시지 */}
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">상세 내용</h4>
                  <p className="text-slate-600">{selectedAlert.message}</p>
                </div>

                {/* 권장 조치 */}
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">권장 조치</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {selectedAlert.riskLevel === 'red' && (
                      <>
                        <li className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-red-500" />
                          아동보호전문기관 즉시 연락
                        </li>
                        <li className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-red-500" />
                          보호자 긴급 면담 요청
                        </li>
                      </>
                    )}
                    {selectedAlert.riskLevel === 'orange' && (
                      <>
                        <li className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-orange-500" />
                          전문 상담사 연계
                        </li>
                        <li className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-orange-500" />
                          상담 일지 작성
                        </li>
                      </>
                    )}
                    {selectedAlert.riskLevel === 'yellow' && (
                      <>
                        <li className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-yellow-500" />
                          담임교사 주의 관찰
                        </li>
                        <li className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-yellow-500" />
                          관찰 기록 작성
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/monitoring/${selectedAlert.studentId}`}>
                    학생 상세 보기
                  </Link>
                </Button>
                <Button
                  className={
                    selectedAlert.riskLevel === 'red'
                      ? 'bg-red-600 hover:bg-red-700'
                      : ''
                  }
                >
                  {selectedAlert.riskLevel === 'red' ? '긴급 연락하기' : '조치 기록하기'}
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
