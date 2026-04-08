import React, { useState } from 'react';
import { 
  LayoutDashboard, Bot, Users, MessageSquare, 
  Vote, TrendingUp, Bell, Calendar, ChevronRight, Settings, X, Check, Brain, Zap, Cpu, Terminal
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- 가상 데이터 (AI 모델 추론량 및 API 트래픽) ---
const inferenceData = [
  { name: '09시', pv: 4200 }, { name: '12시', pv: 8500 }, { name: '15시', pv: 15800 },
  { name: '18시', pv: 11800 }, { name: '21시', pv: 7800 },
];

const App = () => {
  const [isAdmin, setIsAdmin] = useState(true); 
  const [activeTab, setActiveTab] = useState('apply');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [regType, setRegType] = useState('common'); 
  const [selectedDays, setSelectedDays] = useState([]);
  const days = ['Day 1: LLM', 'Day 2: Agentic Workflow', 'Day 3: SaaS Automation', 'Day 4: Infrastructure', 'Day 5: AI Ethics'];

  // --- 메뉴 구성 (AI 에이전트 엑스포 맞춤) ---
  const menuItems = [
    { id: 'dashboard', label: '실시간 엔진 모니터링', icon: <LayoutDashboard size={20}/>, adminOnly: true },
    { id: 'apply', label: '엑스포 정보 및 참가신청', icon: <Calendar size={20}/>, adminOnly: false },
    { id: 'booth', label: '에이전트 부스 배치도', icon: <Cpu size={20}/>, adminOnly: true },
    { id: 'tickets', label: '티켓/패스권 판매 현황', icon: <Bot size={20}/>, adminOnly: true },
    { id: 'vote', label: 'Best Agent 어워즈 투표', icon: <Vote size={20}/>, adminOnly: false },
    { id: 'board', label: '개발자 네트워킹 보드', icon: <MessageSquare size={20}/>, adminOnly: false },
  ];

  const toggleDay = (day) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      
      {/* --- 사이드바 --- */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-6 shadow-sm z-20">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Brain size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter italic leading-none">AGENT EXPO</h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1 uppercase">2026 GLOBAL EDITION</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems
            .filter(item => !item.adminOnly || (item.adminOnly && isAdmin))
            .map(item => (
              <SidebarItem 
                key={item.id}
                icon={item.icon} 
                label={item.label} 
                active={activeTab === item.id} 
                onClick={() => setActiveTab(item.id)} 
              />
            ))
          }
        </nav>

        {/* 관리자 스위치 */}
        <div className="mt-auto p-4 bg-slate-100 rounded-2xl border border-slate-200/50">
          <div className="flex items-center justify-between text-[10px] font-black text-slate-500 mb-3 tracking-widest uppercase">
            <span>{isAdmin ? 'Dev Terminal' : 'User View'}</span>
            <button 
              onClick={() => {setIsAdmin(!isAdmin); setActiveTab('apply');}}
              className={`w-10 h-5 rounded-full transition-colors relative ${isAdmin ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isAdmin ? 'left-6' : 'left-1'}`}></div>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold italic text-indigo-600">SY</div>
            <span className="text-xs font-bold text-slate-700">{isAdmin ? '김성용 시스템 개발자' : '일반 방문객'}</span>
          </div>
        </div>
      </aside>

      {/* --- 메인 영역 --- */}
      <main className="flex-1 overflow-y-auto p-10 relative">
        <header className="flex justify-between items-end mb-10">
          <div>
            <span className="text-indigo-600 text-xs font-black tracking-widest uppercase mb-1 block italic">Beyond LLM: The Era of Agents</span>
            <h2 className="text-4xl font-black tracking-tighter italic uppercase underline decoration-indigo-500/30 underline-offset-8">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h2>
          </div>
          {activeTab === 'apply' && !isAdmin && (
            <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black italic shadow-2xl shadow-indigo-100 hover:-translate-y-1 transition group">
              엑스포 패스 신청하기 <ChevronRight size={18} className="inline ml-1 group-hover:translate-x-1 transition" />
            </button>
          )}
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* 1. 대시보드 (관리자 전용) */}
          {activeTab === 'dashboard' && isAdmin && (
            <div className="space-y-8">
              <div className="grid grid-cols-3 gap-6">
                <StatBox label="실시간 API 호출량" value="2,450,120" change="+32%" />
                <StatBox label="연동 에이전트 수" value="8,420" change="+15.4%" />
                <StatBox label="GPU 클러스터 점유율" value="88.2%" change="MAX" />
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-lg italic flex items-center gap-2"><TrendingUp size={20} className="text-indigo-600"/> 네트워크 추론 트래픽 분석</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={inferenceData}>
                      <defs><linearGradient id="cPv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/><stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/></linearGradient></defs>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <Tooltip />
                      <Area type="monotone" dataKey="pv" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#cPv)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* 4. 부스 관리 (AI 기업/에이전트) */}
          {activeTab === 'booth' && isAdmin && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 uppercase">
                  <tr className="text-[10px] font-black text-slate-400 tracking-widest">
                    <th className="px-8 py-5">참가 에이전트 / 기업</th><th className="px-8 py-5">유형</th><th className="px-8 py-5">배정 구역</th><th className="px-8 py-5">상태</th><th className="px-8 py-5 text-right">설정</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <BoothRow company="DeepSeek Korea" type="LLM Model" zone="Alpha-01" status="연동완료" />
                  <BoothRow company="AI Agent System" type="SaaS Agent" zone="Beta-05" status="테스트중" />
                  <BoothRow company="TradingBot One" type="Quant" zone="Gamma-12" status="대기중" />
                </tbody>
              </table>
            </div>
          )}

          {/* 5. 티켓/패스권 판매 현황 (새로 추가된 섹션) */}
          {activeTab === 'tickets' && isAdmin && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-4 gap-6">
                <StatBox label="총 매출액" value="₩42,500,000" change="+12%" />
                <StatBox label="누적 티켓 판매" value="1,084매" change="+8%" />
                <StatBox label="얼리버드 잔여" value="42매" change="HOT" />
                <StatBox label="무료 초대권 발송" value="156건" change="-2%" />
              </div>

              <div className="grid grid-cols-3 gap-8">
                {/* 티켓 유형별 분포 (심플 차트 대용 리스트) */}
                <div className="col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-black italic mb-6 uppercase tracking-tighter">Sales Distribution</h3>
                  <div className="space-y-6">
                    {[
                      { label: 'Standard Pass', count: 650, color: 'bg-indigo-600' },
                      { label: 'Developer Pass', count: 320, color: 'bg-emerald-500' },
                      { label: 'VIP Networking', count: 84, color: 'bg-amber-500' },
                      { label: 'Sponsor Pass', count: 30, color: 'bg-slate-900' },
                    ].map((item) => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase italic tracking-widest text-slate-400">
                          <span>{item.label}</span>
                          <span>{Math.round((item.count / 1084) * 100)}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`${item.color} h-full rounded-full`} style={{ width: `${(item.count / 800) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 실시간 결제 로그 */}
                <div className="col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">Recent Transactions</h3>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black rounded-lg">LIVE SYNC ON</span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {[
                      { user: '이*혁', type: 'Developer Pass', price: '₩150,000', time: '2분 전', status: 'Success' },
                      { user: '박*서', type: 'Standard Pass', price: '₩80,000', time: '5분 전', status: 'Success' },
                      { user: 'Global AI Labs', type: 'Sponsor Pass (10)', price: '₩5,000,000', time: '12분 전', status: 'Pending' },
                      { user: '정*우', type: 'VIP Networking', price: '₩350,000', time: '18분 전', status: 'Success' },
                    ].map((tx, i) => (
                      <div key={i} className="p-6 hover:bg-slate-50 transition flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">{tx.user[0]}</div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 italic">{tx.user}</p>
                            <p className="text-[10px] font-black text-indigo-600 uppercase italic tracking-widest">{tx.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black italic tracking-tighter">{tx.price}</p>
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-[10px] font-bold text-slate-300 font-mono italic">{tx.time}</span>
                            <span className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Success' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. 인기도 투표 (Best Agent Awards) */}
          {activeTab === 'vote' && (
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="text-center">
                <h3 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Most Innovative AI Agent</h3>
                <p className="text-slate-500 font-medium italic">2026년을 빛낸 최고의 자율형 에이전트를 선정해 주세요.</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { name: 'DeepSeek-V3 Coder', icon: '💻', votes: 2150, color: 'bg-indigo-600' },
                  { name: 'AI Marketing Bot', icon: '🚀', votes: 1840, color: 'bg-slate-800' },
                  { name: 'SkinTone AI Planner', icon: '🎨', votes: 1560, color: 'bg-emerald-500' },
                  { name: 'Quant Engine Pro', icon: '📊', votes: 1200, color: 'bg-amber-500' },
                ].map(item => (
                  <div key={item.name} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-5xl drop-shadow-lg">{item.icon}</span>
                      <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black italic group-hover:bg-indigo-600 transition">VOTE</div>
                    </div>
                    <h4 className="text-2xl font-black italic tracking-tighter mb-4 uppercase">{item.name}</h4>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${(item.votes / 2500) * 100}%` }}></div>
                    </div>
                    <p className="text-[10px] font-black text-slate-300 mt-3 tracking-widest uppercase italic">{item.votes} NEURAL SYNCED</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. 게시판 (포럼) */}
          {activeTab === 'board' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-indigo-600"><Terminal size={20}/></div>
                  <h3 className="text-2xl font-black italic">AGENT DEV FORUM</h3>
                </div>
                <button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black italic shadow-lg hover:bg-indigo-600 transition tracking-tighter">New Thread</button>
              </div>
              <div className="divide-y divide-slate-50">
                {[
                  { t: 'DeepSeek-V3 MoE 레이어 최적화 기술 공유', u: 'Admin_SY', d: '2026.04.07', l: 452, r: 92 },
                  { t: 'ml + llm 활용한 자동마케팅 파이프라인 구축', u: 'AutoGuru', d: '2026.04.07', l: 215, r: 34 },
                  { t: 'Ollama + LLM를 이용한 자동마케팅 파이프라인 구축', u: 'QuantDev', d: '2026.04.06', l: 189, r: 56 },
                ].map((post, i) => (
                  <div key={i} className="p-8 hover:bg-slate-50 transition cursor-pointer group">
                    <div className="flex justify-between mb-3"><h4 className="text-lg font-bold group-hover:text-indigo-600 transition tracking-tight">{post.t}</h4><span className="text-[10px] font-bold text-slate-300 font-mono italic">{post.d}</span></div>
                    <div className="flex items-center gap-6">
                      <span className="text-xs font-medium text-slate-400">by {post.u}</span>
                      <div className="flex items-center gap-4 ml-auto">
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase italic"><Zap size={12}/> {post.l}</span>
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 uppercase italic"><MessageSquare size={12}/> {post.r}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. 행사 소개 및 신청 */}
          {activeTab === 'apply' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="w-full h-96 bg-slate-900 rounded-[3rem] shadow-inner overflow-hidden flex flex-col items-center justify-center border-4 border-white relative group">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-30 group-hover:scale-110 transition-transform duration-700"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 to-transparent"></div>
                  <Cpu size={60} className="text-indigo-400 mb-4 animate-pulse relative z-10" />
                  <p className="text-white font-black italic uppercase tracking-tighter z-10 text-3xl text-center leading-none">THE NEXT <br/>INTELLIGENCE</p>
                  <div className="mt-4 px-6 py-2 bg-white/10 backdrop-blur-md rounded-2xl text-[10px] font-black text-white tracking-widest uppercase italic shadow-sm z-10 border border-white/20">LIVE: 2026.05.12 - 05.17</div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-4xl font-black italic tracking-tighter leading-tight">
                    AUTONOMOUS <br/> 
                    <span className="text-indigo-600 underline decoration-indigo-500/20 underline-offset-8">AGENT WORKFLOWS</span>
                  </h3>
                  <p className="text-slate-500 leading-relaxed font-medium italic text-lg">
                    단순한 챗봇의 시대는 끝났습니다. 2026 AI 에이전트 엑스포에서는 스스로 계획하고, 도구를 사용하며, 
                    복잡한 비즈니스 로직을 완수하는 '행동하는 AI'의 정점을 경험할 수 있습니다.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {['DeepSeek 기술 세미나', '에이전트 데모 쇼케이스', 'SaaS 비즈니스 매칭', 'GPU 인프라 최적화'].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 italic">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-indigo-600 p-12 rounded-[3.5rem] text-white flex flex-col justify-between shadow-2xl shadow-indigo-100 relative overflow-hidden min-h-[500px]">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10">
                    <p className="text-xs font-black tracking-widest opacity-60 mb-2 uppercase italic">Registration Progress</p>
                    <p className="text-5xl font-black italic mb-10 tracking-tighter underline decoration-white/20 underline-offset-8 uppercase">Neural Link: 94%</p>
                    
                    <div className="space-y-6 mb-12">
                      <div className="flex justify-between border-b border-white/10 pb-3 font-bold uppercase tracking-widest text-xs">
                        <span>일반 컨퍼런스 패스</span>
                        <span className="font-mono text-indigo-200">12 / 1,200</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-3 font-bold uppercase tracking-widest text-xs">
                        <span>기업 전시/스폰서십</span>
                        <span className="font-mono text-indigo-200">2 / 50</span>
                      </div>
                    </div>

                    <div className="p-6 bg-white/10 rounded-3xl border border-white/20 flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-2xl"><Bell size={24}/></div>
                      <p className="text-xs font-medium opacity-90 leading-normal">
                        <span className="font-black block mb-1 underline">SYSTEM NOTICE</span>
                        DeepSeek-V3 Coder 오픈소스 기여자를 위한 무료 입장권 이벤트가 4월 20일 마감됩니다.
                      </p>
                    </div>
                  </div>

                  {!isAdmin && (
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="relative z-10 mt-8 w-full bg-white text-indigo-600 py-6 rounded-[2rem] font-black italic text-xl tracking-tighter hover:bg-slate-50 transition-all shadow-xl flex items-center justify-center gap-3 group"
                    >
                      지금 엑스포 신청하기
                      <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  )}
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl text-indigo-600"><Calendar size={24}/></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Event Schedule</p>
                      <p className="text-lg font-black italic">2026.05.12 - 05.17</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Main Stage</p>
                    <p className="text-lg font-black italic text-indigo-600">COEX GRAND BALLROOM</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- 참가 신청 모달 --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-white animate-in zoom-in-95 duration-500">
            <div className="p-10 bg-indigo-600 text-white flex justify-between items-center relative overflow-hidden">
              <div className="relative z-10"><h3 className="text-2xl font-black italic tracking-tighter">EXPO REGISTRATION</h3><p className="text-indigo-200 text-xs font-bold tracking-widest mt-1 uppercase">참가 신청서</p></div>
              <button onClick={() => setIsModalOpen(false)} className="z-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition group"><X size={24}/></button>
            </div>
            
            <div className="p-12 space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Ticket Type</label>
                <div className="flex gap-4 p-2 bg-slate-100 rounded-3xl border border-slate-200/50">
                  <button onClick={() => setRegType('common')} className={`flex-1 py-4 rounded-2xl text-sm font-black italic transition-all ${regType === 'common' ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-400'}`}>FULL PASS</button>
                  <button onClick={() => setRegType('daily')} className={`flex-1 py-4 rounded-2xl text-sm font-black italic transition-all ${regType === 'daily' ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-400'}`}>DAILY SESSION</button>
                </div>
              </div>

              <button onClick={() => {alert("AI 에이전트 엑스포 신청이 완료되었습니다."); setIsModalOpen(false);}} className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black italic tracking-tighter hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-200">PROCEED TO CHECKOUT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 보조 컴포넌트 ---
const SidebarItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${active ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100/50' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
    <span className={active ? 'text-indigo-600 scale-110 transition-transform' : 'text-slate-400'}>{icon}</span>
    <span className="font-bold text-sm tracking-tight">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200 animate-pulse"></div>}
  </button>
);

const StatBox = ({ label, value, change }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">{label}</p>
    <div className="flex items-end justify-between"><h4 className="text-3xl font-black italic tracking-tighter">{value}</h4><span className={`text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase ${change.includes('+') ? 'text-emerald-600 bg-emerald-50' : 'text-indigo-600 bg-indigo-50'}`}>{change}</span></div>
  </div>
);

const BoothRow = ({ company, type, zone, status }) => (
  <tr className="hover:bg-slate-50/50 transition border-b border-slate-50 last:border-0 group">
    <td className="px-8 py-6"><p className="font-bold text-slate-800 group-hover:text-indigo-600 transition italic tracking-tight">{company}</p></td>
    <td className="px-8 py-6"><span className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg border uppercase italic ${type === 'LLM Model' ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>{type}</span></td>
    <td className="px-8 py-6"><span className="text-xs font-mono font-bold text-slate-400 uppercase">{zone}</span></td>
    <td className="px-8 py-6"><span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase italic ${status === '연동완료' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>{status}</span></td>
    <td className="px-8 py-6 text-right"><button className="text-[10px] font-black text-slate-300 hover:text-indigo-600 transition uppercase italic tracking-widest underline underline-offset-4">Modify</button></td>
  </tr>
);

export default App;