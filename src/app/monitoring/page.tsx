'use client';

import { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { generateStudentMonitoring, riskLevelConfig, classRooms } from '@/lib/mock-data';
import { RiskLevel } from '@/types';
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  MoreVertical,
  Eye,
  MessageSquare,
  FileText,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function MonitoringPage() {
  const monitoring = useMemo(() => generateStudentMonitoring(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'all'>('all');

  // 필터링
  const filteredStudents = monitoring.filter((item) => {
    const matchesSearch = item.student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'all' || item.student.classRoom === selectedClass;
    const matchesRisk = selectedRisk === 'all' || item.currentRiskLevel === selectedRisk;
    return matchesSearch && matchesClass && matchesRisk;
  });

  // 위험도 순 정렬
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const order = { red: 0, orange: 1, yellow: 2, green: 3 };
    return order[a.currentRiskLevel] - order[b.currentRiskLevel];
  });

  return (
    <DashboardLayout title="학생 모니터링" subtitle="전체 학생 음성 감정 분석 현황">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(['green', 'yellow', 'orange', 'red'] as RiskLevel[]).map((level) => {
            const config = riskLevelConfig[level];
            const count = monitoring.filter((m) => m.currentRiskLevel === level).length;
            return (
              <Card
                key={level}
                className={`border-0 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                  selectedRisk === level ? 'ring-2 ring-violet-500' : ''
                }`}
                onClick={() => setSelectedRisk(selectedRisk === level ? 'all' : level)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{config.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{count}명</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full ${
                      level === 'green' ? 'bg-green-500' :
                      level === 'yellow' ? 'bg-yellow-500' :
                      level === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                    }`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="search"
                  placeholder="학생 이름 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Class Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    {selectedClass === 'all' ? '전체 반' : selectedClass}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedClass('all')}>
                    전체 반
                  </DropdownMenuItem>
                  {classRooms.map((room) => (
                    <DropdownMenuItem
                      key={room.id}
                      onClick={() => setSelectedClass(room.name)}
                    >
                      {room.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Reset */}
              {(searchQuery || selectedClass !== 'all' || selectedRisk !== 'all') && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedClass('all');
                    setSelectedRisk('all');
                  }}
                >
                  필터 초기화
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Student Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">
              학생 목록 ({sortedStudents.length}명)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>학생</TableHead>
                  <TableHead>반</TableHead>
                  <TableHead>위험도</TableHead>
                  <TableHead>위험 점수</TableHead>
                  <TableHead>기준선 대비</TableHead>
                  <TableHead>마지막 분석</TableHead>
                  <TableHead>알림</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStudents.map((item) => {
                  const config = riskLevelConfig[item.currentRiskLevel];
                  const trend = item.weeklyTrend;
                  const lastScore = trend[trend.length - 1]?.riskScore || 0;
                  const prevScore = trend[trend.length - 2]?.riskScore || lastScore;
                  const scoreDiff = lastScore - prevScore;

                  return (
                    <TableRow key={item.student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                            item.currentRiskLevel === 'green' ? 'bg-green-500' :
                            item.currentRiskLevel === 'yellow' ? 'bg-yellow-500' :
                            item.currentRiskLevel === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                          }`}>
                            {item.student.name[0]}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{item.student.name}</p>
                            <p className="text-sm text-slate-500">{item.student.age}세</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-600">{item.student.classRoom}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${config.bgColor} ${config.color} border-0`}>
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">{Math.round(lastScore)}</span>
                          {scoreDiff > 2 ? (
                            <TrendingUp className="w-4 h-4 text-red-500" />
                          ) : scoreDiff < -2 ? (
                            <TrendingDown className="w-4 h-4 text-green-500" />
                          ) : (
                            <Minus className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`${
                          item.baselineDeviation > 30 ? 'text-red-600' :
                          item.baselineDeviation > 15 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          +{item.baselineDeviation.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-500 text-sm">
                          {formatDistanceToNow(new Date(item.lastUpdated), { addSuffix: true, locale: ko })}
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.alertCount > 0 ? (
                          <Badge variant="destructive" className="text-xs">
                            {item.alertCount}
                          </Badge>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/monitoring/${item.student.id}`}>
                                <Eye className="w-4 h-4 mr-2" /> 상세 보기
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="w-4 h-4 mr-2" /> 상담 기록
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="w-4 h-4 mr-2" /> 리포트 생성
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
