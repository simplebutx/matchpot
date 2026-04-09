import {
  Bot,
  Brain,
  Calendar,
  Cpu,
  LayoutDashboard,
  MessageSquare,
  Vote,
} from 'lucide-react';

export const inferenceData = [
  { name: '09:00', pv: 4200 },
  { name: '12:00', pv: 8500 },
  { name: '15:00', pv: 15800 },
  { name: '18:00', pv: 11800 },
  { name: '21:00', pv: 7800 },
];

export const menuItems = [
  { id: 'dashboard', label: '실시간 운영 모니터링', icon: LayoutDashboard, adminOnly: true },
  { id: 'apply', label: '행사 정보 및 참가 신청', icon: Calendar, adminOnly: false },
  { id: 'booth', label: '에이전트 부스 배치', icon: Cpu, adminOnly: true },
  { id: 'vote', label: 'Best Agent 어워즈 투표', icon: Vote, adminOnly: false },
  { id: 'board', label: '개발자 네트워킹 보드', icon: MessageSquare, adminOnly: false },
];

export const stats = [
  { label: '실시간 API 호출 수', value: '2,450,120', change: '+32%' },
  { label: '활성 에이전트 수', value: '8,420', change: '+15.4%' },
  { label: 'GPU 가동률', value: '88.2%', change: 'MAX' },
];

export const boothItems = [
  { name: 'DeepSeek Korea', type: 'LLM MODEL', slot: 'Alpha-01', status: '배정 완료', tone: 'orange' },
  { name: 'AI Agent System', type: 'SAAS AGENT', slot: 'Beta-05', status: '심사 중', tone: 'indigo' },
  { name: 'TradingBot One', type: 'QUANT', slot: 'Gamma-12', status: '대기 중', tone: 'slate' },
];

export const voteItems = [
  { name: 'DeepSeek-V3 Coder', icon: Bot, votes: 2150, color: '#4f46e5' },
  { name: 'AI Marketing Bot', icon: Brain, votes: 1840, color: '#0f172a' },
  { name: 'SkinTone AI Planner', icon: Calendar, votes: 1560, color: '#10b981' },
  { name: 'Quant Engine Pro', icon: Cpu, votes: 1200, color: '#f59e0b' },
];

export const boardPosts = [
  { title: 'DeepSeek-V3 MoE 최적화 기술 공유', user: 'Admin_SY', date: '2026.04.07', likes: 452 },
  { title: 'AI 에이전트 마케팅 자동화 파이프라인 구현', user: 'AutoGuru', date: '2026.04.07', likes: 215 },
  { title: 'Ollama 기반 온디바이스 에이전트 실험', user: 'QuantDev', date: '2026.04.06', likes: 189 },
];

export const myPageActivities = [
  { title: '참가 신청서 제출 완료', detail: 'Agent Expo 2026 일반 컨퍼런스 패스', time: '오늘 09:40' },
  { title: 'Best Agent 투표 참여', detail: 'DeepSeek-V3 Coder에 1표를 행사했습니다.', time: '어제 18:25' },
  { title: '네트워킹 세션 예약', detail: 'AI Workflow Roundtable / 5월 14일 14:00', time: '4월 7일' },
];
