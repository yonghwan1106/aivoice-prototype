'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { alerts, riskLevelConfig } from '@/lib/mock-data';
import { AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export function RecentAlerts() {
  const recentAlerts = alerts.slice(0, 4);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">최근 알림</CardTitle>
        <Link href="/alerts">
          <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700">
            전체 보기 <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentAlerts.map((alert) => {
          const config = riskLevelConfig[alert.riskLevel];
          return (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border-l-4 ${config.bgColor} ${config.borderColor}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg ${
                    alert.riskLevel === 'red' ? 'bg-red-200' :
                    alert.riskLevel === 'orange' ? 'bg-orange-200' :
                    'bg-yellow-200'
                  }`}>
                    <AlertTriangle className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{alert.studentName}</span>
                      <Badge variant="outline" className={`${config.color} ${config.borderColor} text-xs`}>
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5 line-clamp-2">{alert.message}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true, locale: ko })}
                    </div>
                  </div>
                </div>
                {!alert.isRead && (
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
