import { Calendar, Cpu, LayoutDashboard, Vote } from 'lucide-react';

export const menuItems = [
  { id: 'apply', label: '행사 목록', icon: Calendar, adminOnly: false },
  { id: 'createEvent', label: '행사 등록', icon: Vote, adminOnly: false },
  { id: 'eventManagement', label: '행사 관리 및 리뷰 분석', icon: Cpu, adminOnly: false },
  { id: 'aiSolution', label: 'AI 추천받기', icon: LayoutDashboard, adminOnly: false }
  // { id: 'dashboard', label: '대시보드', icon: LayoutDashboard, adminOnly: true },
  // { id: 'booth', label: '부스 배치', icon: Cpu, adminOnly: true },
  // { id: 'vote', label: '행사 리뷰', icon: Vote, adminOnly: false },
  // { id: 'board', label: '커뮤니티 보드', icon: MessageSquare, adminOnly: false },
];

export const inferenceData = [
  { name: '09:00', pv: 4200 },
  { name: '12:00', pv: 8500 },
  { name: '15:00', pv: 15800 },
  { name: '18:00', pv: 11800 },
  { name: '21:00', pv: 7800 },
];

export const stats = [
  { label: '실시간 API 호출 수', value: '2,450,120', change: '+32%' },
  { label: '활성 사용자 수', value: '8,420', change: '+15.4%' },
  { label: 'GPU 가동률', value: '88.2%', change: 'MAX' },
];

export const boothItems = [
  { name: 'DeepSeek Korea', type: 'LLM MODEL', slot: 'Alpha-01', status: '배정 완료', tone: 'orange' },
  { name: 'AI Agent System', type: 'SAAS AGENT', slot: 'Beta-05', status: '심사 중', tone: 'indigo' },
  { name: 'TradingBot One', type: 'QUANT', slot: 'Gamma-12', status: '대기 중', tone: 'slate' },
];

export const voteItems = [
  { name: 'DeepSeek-V3 Coder', icon: LayoutDashboard, votes: 2150, color: '#4f46e5' },
  { name: 'AI Marketing Bot', icon: Vote, votes: 1840, color: '#0f172a' },
  { name: 'SkinTone AI Planner', icon: Calendar, votes: 1560, color: '#10b981' },
  { name: 'Quant Engine Pro', icon: Cpu, votes: 1200, color: '#f59e0b' },
];

export const boardPosts = [
  { title: 'DeepSeek-V3 MoE 최적화 기술 공유', user: 'Admin_SY', date: '2026.04.07', likes: 452 },
  { title: 'AI 에이전트 마케팅 자동화 파이프라인 구현', user: 'AutoGuru', date: '2026.04.07', likes: 215 },
  { title: 'Ollama 기반 온디바이스 에이전트 실험', user: 'QuantDev', date: '2026.04.06', likes: 189 },
];

export const myPageActivities = [
  { title: '참가 신청서 제출 완료', detail: 'Agent Expo 2026 일반 컨퍼런스 신청이 완료되었습니다.', time: '오늘 09:40' },
  { title: 'Best Agent 투표 참여', detail: 'DeepSeek-V3 Coder에 한 표를 등록했습니다.', time: '어제 18:25' },
  { title: '세션 예약 완료', detail: 'AI Workflow Roundtable / 5월 14일 14:00', time: '4월 7일' },
];
