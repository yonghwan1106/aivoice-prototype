'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { generateStudentMonitoring, riskLevelConfig } from '@/lib/mock-data';
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

export function StudentQuickList() {
  const monitoring = useMemo(() => generateStudentMonitoring(), []);

  // 위험도가 높은 학생 우선 정렬
  const sortedStudents = [...monitoring].sort((a, b) => {
    const order = { red: 0, orange: 1, yellow: 2, green: 3 };
    return order[a.currentRiskLevel] - order[b.currentRiskLevel];
  }).slice(0, 6);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">학생 현황</CardTitle>
        <Link href="/monitoring">
          <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700">
            전체 보기 <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedStudents.map((item) => {
            const config = riskLevelConfig[item.currentRiskLevel];
            const trend = item.weeklyTrend;
            const lastScore = trend[trend.length - 1]?.riskScore || 0;
            const prevScore = trend[trend.length - 2]?.riskScore || lastScore;
            const scoreDiff = lastScore - prevScore;

            return (
              <Link
                key={item.student.id}
                href={`/monitoring/${item.student.id}`}
                className="block"
              >
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                    item.currentRiskLevel === 'green' ? 'bg-green-500' :
                    item.currentRiskLevel === 'yellow' ? 'bg-yellow-500' :
                    item.currentRiskLevel === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                  }`}>
                    {item.student.name[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{item.student.name}</span>
                      <Badge variant="outline" className={`${config.color} text-xs`}>
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500">{item.student.classRoom} · {item.student.grade}</p>
                  </div>

                  {/* Risk Score */}
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-semibold text-slate-900">
                        {Math.round(lastScore)}
                      </span>
                      {scoreDiff > 2 ? (
                        <TrendingUp className="w-4 h-4 text-red-500" />
                      ) : scoreDiff < -2 ? (
                        <TrendingDown className="w-4 h-4 text-green-500" />
                      ) : (
                        <Minus className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400">위험 점수</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
