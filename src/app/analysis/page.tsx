'use client';

import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { students, riskLevelConfig, emotionConfig, generateVoiceAnalysis } from '@/lib/mock-data';
import { VoiceAnalysis, RiskLevel } from '@/types';
import {
  Mic,
  Square,
  Play,
  RotateCcw,
  Volume2,
  Activity,
  Brain,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from 'lucide-react';

type AnalysisState = 'idle' | 'recording' | 'processing' | 'complete';

export default function AnalysisPage() {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [result, setResult] = useState<VoiceAnalysis | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 녹음 시뮬레이션
  const startRecording = () => {
    if (!selectedStudent) return;
    setAnalysisState('recording');
    setRecordingTime(0);
    setResult(null);

    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setAnalysisState('processing');
    simulateAnalysis();
  };

  // 분석 시뮬레이션
  const simulateAnalysis = () => {
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // 랜덤 위험도 생성
          const riskLevels: RiskLevel[] = ['green', 'green', 'green', 'yellow', 'orange', 'red'];
          const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
          const analysis = generateVoiceAnalysis(selectedStudent, randomRisk);
          setResult(analysis);
          setAnalysisState('complete');
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const resetAnalysis = () => {
    setAnalysisState('idle');
    setRecordingTime(0);
    setAnalysisProgress(0);
    setResult(null);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout title="음성 분석" subtitle="실시간 아동 음성 감정 분석 데모">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 녹음 섹션 */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-violet-600" />
              음성 녹음
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 학생 선택 */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                분석 대상 학생
              </label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="학생을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.classRoom})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 녹음 인터페이스 */}
            <div className="flex flex-col items-center py-8">
              {/* 녹음 버튼 */}
              <div className="relative">
                <button
                  onClick={analysisState === 'recording' ? stopRecording : startRecording}
                  disabled={!selectedStudent || analysisState === 'processing'}
                  className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                    analysisState === 'recording'
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                      : analysisState === 'processing'
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-violet-600 hover:bg-violet-700'
                  } ${!selectedStudent ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {analysisState === 'recording' ? (
                    <Square className="w-12 h-12 text-white" />
                  ) : analysisState === 'processing' ? (
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                  ) : (
                    <Mic className="w-12 h-12 text-white" />
                  )}
                </button>

                {/* 녹음 중 파형 애니메이션 */}
                {analysisState === 'recording' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-40 h-40 rounded-full border-4 border-red-300 animate-ping opacity-30" />
                  </div>
                )}
              </div>

              {/* 상태 텍스트 */}
              <div className="mt-6 text-center">
                {analysisState === 'idle' && (
                  <p className="text-slate-500">
                    {selectedStudent ? '버튼을 눌러 녹음을 시작하세요' : '먼저 학생을 선택하세요'}
                  </p>
                )}
                {analysisState === 'recording' && (
                  <div>
                    <p className="text-red-600 font-medium">녹음 중...</p>
                    <p className="text-3xl font-mono mt-2">{formatTime(recordingTime)}</p>
                    <p className="text-sm text-slate-500 mt-2">정지 버튼을 눌러 분석을 시작합니다</p>
                  </div>
                )}
                {analysisState === 'processing' && (
                  <div className="w-full max-w-xs">
                    <p className="text-violet-600 font-medium mb-2">AI 분석 중...</p>
                    <Progress value={analysisProgress} className="h-2" />
                    <p className="text-sm text-slate-500 mt-2">음성 특징 추출 및 감정 분석</p>
                  </div>
                )}
                {analysisState === 'complete' && (
                  <div>
                    <p className="text-green-600 font-medium flex items-center gap-2 justify-center">
                      <CheckCircle className="w-5 h-5" />
                      분석 완료
                    </p>
                    <Button variant="outline" className="mt-4" onClick={resetAnalysis}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      다시 분석
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* 녹음 안내 */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-700 mb-2">분석 안내</h4>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>• 30초 이상 녹음 권장</li>
                <li>• 아동의 자연스러운 대화를 녹음해주세요</li>
                <li>• 실제 서비스에서는 원본 음성이 저장되지 않습니다</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 분석 결과 섹션 */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-violet-600" />
              분석 결과
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
                <Activity className="w-16 h-16 mb-4 opacity-50" />
                <p>분석 결과가 여기에 표시됩니다</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 위험도 */}
                <div className={`p-4 rounded-lg ${riskLevelConfig[result.riskLevel].bgColor}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">종합 위험도</p>
                      <p className={`text-2xl font-bold ${riskLevelConfig[result.riskLevel].color}`}>
                        {riskLevelConfig[result.riskLevel].label}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">위험 점수</p>
                      <p className="text-3xl font-bold text-slate-900">
                        {Math.round(result.riskScore)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    {riskLevelConfig[result.riskLevel].description}
                  </p>
                </div>

                {/* 감정 분석 */}
                <div>
                  <h4 className="font-medium text-slate-700 mb-3">감정 분석</h4>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                    <span className="text-4xl">{emotionConfig[result.tone.primary].emoji}</span>
                    <div>
                      <p className="font-medium text-slate-900">
                        {emotionConfig[result.tone.primary].label}
                      </p>
                      <p className="text-sm text-slate-500">
                        신뢰도: {Math.round(result.tone.confidence)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* 상세 지표 */}
                <div>
                  <h4 className="font-medium text-slate-700 mb-3">음성 지표</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">피치 평균</p>
                      <p className="font-semibold">{Math.round(result.pitch.average)} Hz</p>
                      <p className="text-xs text-slate-400">{
                        result.pitch.trend === 'stable' ? '안정적' :
                        result.pitch.trend === 'increasing' ? '상승 추세' : '하락 추세'
                      }</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">말 속도</p>
                      <p className="font-semibold">{Math.round(result.speed.wordsPerMinute)} WPM</p>
                      <p className="text-xs text-slate-400">{
                        result.speed.trend === 'normal' ? '정상' :
                        result.speed.trend === 'fast' ? '빠름' : '느림'
                      }</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">음성 떨림</p>
                      <p className="font-semibold">{result.tremor.detected ? '감지됨' : '미감지'}</p>
                      <p className="text-xs text-slate-400">강도: {result.tremor.intensity}%</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">비정상 침묵</p>
                      <p className="font-semibold">{result.silencePattern.unusualPauses}회</p>
                      <p className="text-xs text-slate-400">총 {Math.round(result.silencePattern.totalSilence)}초</p>
                    </div>
                  </div>
                </div>

                {/* 권장 조치 */}
                {result.riskLevel !== 'green' && (
                  <div className={`p-4 rounded-lg border ${
                    result.riskLevel === 'red' ? 'border-red-300 bg-red-50' :
                    result.riskLevel === 'orange' ? 'border-orange-300 bg-orange-50' :
                    'border-yellow-300 bg-yellow-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-5 h-5 ${riskLevelConfig[result.riskLevel].color}`} />
                      <div>
                        <p className="font-medium text-slate-900">권장 조치</p>
                        <p className="text-sm text-slate-600 mt-1">
                          {result.riskLevel === 'red'
                            ? '즉시 아동보호전문기관에 연계가 필요합니다. 담당자에게 알림이 전송되었습니다.'
                            : result.riskLevel === 'orange'
                            ? '전문 상담사와의 상담을 권장합니다. 상담 일정을 잡아주세요.'
                            : '담임교사의 지속적인 관찰이 필요합니다. 정기적으로 음성 분석을 진행해주세요.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
