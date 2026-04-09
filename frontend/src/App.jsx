// import './App.css'
// import Home from './shared/pages/Home'
// import Login from './features/auth/pages/Login';
// import Signup from './features/auth/pages/Signup';
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// function App() {

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path='/signup' element={<Signup />} />
//         <Route path='/login' element={<Login />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App


import React, { useState } from 'react';
import styles from '@/App.module.css';
import { 
  LayoutDashboard, Bot, MessageSquare, Vote, TrendingUp, 
  Calendar, ChevronRight, X, Brain, Cpu, Zap, Check, Bell, Terminal
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const inferenceData = [
  { name: '09시', pv: 4200 }, { name: '12시', pv: 8500 }, { name: '15시', pv: 15800 },
  { name: '18시', pv: 11800 }, { name: '21시', pv: 7800 },
];

const App = () => {
  const [isAdmin, setIsAdmin] = useState(true); 
  const [activeTab, setActiveTab] = useState('apply');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: '실시간 엔진 모니터링', icon: <LayoutDashboard size={20}/>, adminOnly: true },
    { id: 'apply', label: '엑스포 정보 및 참가신청', icon: <Calendar size={20}/>, adminOnly: false },
    { id: 'booth', label: '에이전트 부스 배치도', icon: <Cpu size={20}/>, adminOnly: true },
    { id: 'vote', label: 'Best Agent 어워즈 투표', icon: <Vote size={20}/>, adminOnly: false },
    { id: 'board', label: '개발자 네트워킹 보드', icon: <MessageSquare size={20}/>, adminOnly: false },
  ];

  return (
    <div className={styles.layout}>
      {/* --- 사이드바 --- */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}><Brain size={24} /></div>
          <div className={styles.logoText}>
            <h1>AGENT EXPO</h1>
            <p style={{fontSize:'10px', color:'#94a3b8', fontWeight:'bold'}}>2026 GLOBAL EDITION</p>
          </div>
        </div>
        <nav className={styles.nav}>
          {menuItems.filter(i => !i.adminOnly || isAdmin).map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`${styles.sidebarItem} ${activeTab === item.id ? styles.itemActive : styles.itemInactive}`}>
              {item.icon} <b>{item.label}</b>
            </button>
          ))}
        </nav>
        <button onClick={() => setIsAdmin(!isAdmin)} style={{marginTop:'auto', padding:'12px', background:'#f1f5f9', border:'none', borderRadius:'12px', cursor:'pointer', fontWeight:'900', fontSize:'11px', color:'#64748b'}}>
           {isAdmin ? "🔒 DEV TERMINAL" : "👤 USER VIEW"}
        </button>
      </aside>

      {/* --- 메인 콘텐츠 --- */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <span style={{color:'#4f46e5', fontSize:'12px', fontWeight:'900', fontStyle:'italic', textTransform:'uppercase'}}>Beyond LLM: The Era of Agents</span>
            <h2 className={styles.headerTitle}>{menuItems.find(m => m.id === activeTab)?.label}</h2>
          </div>
          {activeTab === 'apply' && !isAdmin && (
            <button className={styles.applyBtn} onClick={() => setIsModalOpen(true)}>
              엑스포 패스 신청하기 <ChevronRight size={18} style={{display:'inline', marginLeft:'4px'}} />
            </button>
          )}
        </header>

        {/* 1. 실시간 엔진 모니터링 (대시보드) */}
        {activeTab === 'dashboard' && isAdmin && (
          <div className="animate-in">
            <div className={styles.statGrid}>
              <div className={styles.statBox}><p className={styles.statLabel}>실시간 API 호출량</p><div className={styles.statValueContainer}><h4 className={styles.statValue}>2,450,120</h4><span className={styles.statChange}>+32%</span></div></div>
              <div className={styles.statBox}><p className={styles.statLabel}>연동 에이전트 수</p><div className={styles.statValueContainer}><h4 className={styles.statValue}>8,420</h4><span className={styles.statChange}>+15.4%</span></div></div>
              <div className={styles.statBox}><p className={styles.statLabel}>GPU 점유율</p><div className={styles.statValueContainer}><h4 className={styles.statValue}>88.2%</h4><span className={styles.statChange}>MAX</span></div></div>
            </div>
            <div className={styles.tableCard} style={{padding:'2.5rem'}}>
               <h3 style={{fontWeight:'bold', marginBottom:'24px', fontStyle:'italic'}}><TrendingUp size={20} style={{display:'inline', marginRight:'8px', color: '#4f46e5'}}/> 네트워크 추론 트래픽 분석</h3>
               <div style={{height: '250px'}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={inferenceData}>
                      <XAxis dataKey="name" hide />
                      <Tooltip />
                      <Area type="monotone" dataKey="pv" stroke="#4f46e5" fill="#eef2ff" strokeWidth={4} />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>
        )}

        {/* 2. 엑스포 정보 및 참가신청 (상세 비주얼) */}
        {activeTab === 'apply' && (
          <div className="animate-in" style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem'}}>
            <div style={{display:'flex', flexDirection:'column', gap:'2rem'}}>
              <div style={{background:'#0f172a', padding:'3rem', borderRadius:'3rem', color:'white', textAlign:'center', position:'relative', border:'4px solid white'}}>
                 <Cpu size={60} style={{color:'#4f46e5', marginBottom:'1.5rem'}} />
                 <h3 style={{fontSize:'32px', fontWeight:'900', fontStyle:'italic', textTransform:'uppercase'}}>THE NEXT<br/>INTELLIGENCE</h3>
                 <div style={{marginTop:'1rem', background:'rgba(255,255,255,0.1)', padding:'8px 16px', borderRadius:'12px', fontSize:'12px'}}>LIVE: 2026.05.12 - 05.17</div>
              </div>
              <div>
                <h3 style={{fontSize:'36px', fontWeight:'900', fontStyle:'italic', textTransform:'uppercase'}}>AUTONOMOUS<br/><span style={{color:'#4f46e5'}}>AGENT WORKFLOWS</span></h3>
                <p style={{color:'#64748b', marginTop:'15px', lineHeight:1.6}}>단순한 챗봇의 시대는 끝났습니다. 스스로 계획하고 도구를 사용하는 '행동하는 AI'를 경험하세요.</p>
              </div>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
              <div style={{background:'#4f46e5', padding:'3rem', borderRadius:'3.5rem', color:'white'}}>
                <p style={{fontSize:'12px', fontWeight:'bold', opacity:0.8}}>REGISTRATION PROGRESS</p>
                <h3 style={{fontSize:'42px', fontWeight:'900', fontStyle:'italic', marginTop:'10px'}}>NEURAL LINK: 94%</h3>
                <div style={{marginTop:'2rem', borderTop:'1px solid rgba(255,255,255,0.2)', paddingTop:'20px'}}>
                   <div style={{display:'flex', justifyContent:'space-between', fontSize:'14px', marginBottom:'10px'}}><span>일반 컨퍼런스 패스</span><span>12 / 1,200</span></div>
                   <div style={{display:'flex', justifyContent:'space-between', fontSize:'14px'}}><span>기업 전시/스폰서십</span><span>2 / 50</span></div>
                </div>
              </div>
              <div style={{background:'white', padding:'2rem', borderRadius:'2.5rem', border:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between'}}>
                <div><p style={{fontSize:'10px', color:'#94a3b8'}}>DATE</p><p style={{fontSize:'18px', fontWeight:'900'}}>2026.05.12 - 05.17</p></div>
                <div style={{textAlign:'right'}}><p style={{fontSize:'10px', color:'#94a3b8'}}>LOCATION</p><p style={{fontSize:'18px', fontWeight:'900', color:'#4f46e5'}}>COEX GRAND BALLROOM</p></div>
              </div>
            </div>
          </div>
        )}

        {/* 3. 에이전트 부스 배치도 (관리자용 표) */}
        {activeTab === 'booth' && isAdmin && (
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr><th>참가 에이전트 / 기업</th><th>유형</th><th>배정 구역</th><th>상태</th></tr>
              </thead>
              <tbody>
                <tr><td><b>DeepSeek Korea</b></td><td><span style={{background:'#fff7ed', color:'#c2410c', padding:'4px 8px', borderRadius:'6px', fontSize:'10px', fontWeight:'900'}}>LLM MODEL</span></td><td><code>Alpha-01</code></td><td><span style={{color:'#059669', fontWeight:'bold'}}>● 연동완료</span></td></tr>
                <tr><td><b>AI Agent System</b></td><td><span style={{background:'#eef2ff', color:'#4f46e5', padding:'4px 8px', borderRadius:'6px', fontSize:'10px', fontWeight:'900'}}>SAAS AGENT</span></td><td><code>Beta-05</code></td><td><span style={{color:'#d97706', fontWeight:'bold'}}>● 테스트중</span></td></tr>
                <tr><td><b>TradingBot One</b></td><td><span style={{background:'#f1f5f9', color:'#475569', padding:'4px 8px', borderRadius:'6px', fontSize:'10px', fontWeight:'900'}}>QUANT</span></td><td><code>Gamma-12</code></td><td><span style={{color:'#94a3b8', fontWeight:'bold'}}>● 대기중</span></td></tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Best Agent 어워즈 투표 (투표 카드) */}
        {activeTab === 'vote' && (
          <div className={styles.voteGrid}>
            {[
              { name: 'DeepSeek-V3 Coder', icon: '💻', votes: 2150, color: '#4f46e5' },
              { name: 'AI Marketing Bot', icon: '🚀', votes: 1840, color: '#0f172a' },
              { name: 'SkinTone AI Planner', icon: '🎨', votes: 1560, color: '#10b981' },
              { name: 'Quant Engine Pro', icon: '📊', votes: 1200, color: '#f59e0b' },
            ].map(item => (
              <div key={item.name} className={styles.voteCard}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                  <span style={{fontSize:'40px'}}>{item.icon}</span>
                  <span style={{background:'#0f172a', color:'white', padding:'6px 12px', borderRadius:'10px', fontSize:'10px', fontWeight:'900'}}>VOTE</span>
                </div>
                <h4 style={{fontSize:'20px', fontWeight:'900', fontStyle:'italic'}}>{item.name}</h4>
                <div style={{width:'100%', background:'#f1f5f9', height:'8px', borderRadius:'10px', marginTop:'20px'}}>
                   <div style={{width:`${(item.votes/2500)*100}%`, background:item.color, height:'100%', borderRadius:'10px'}}></div>
                </div>
                <p style={{fontSize:'10px', color:'#94a3b8', marginTop:'10px', fontWeight:'900'}}>{item.votes} NEURAL SYNCED</p>
              </div>
            ))}
          </div>
        )}

        {/* 5. 개발자 네트워킹 보드 (게시판 리스트) */}
        {activeTab === 'board' && (
          <div className={styles.tableCard}>
            <div style={{padding:'25px', borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3 style={{fontWeight:'900', fontStyle:'italic'}}><Terminal size={20} style={{display:'inline', marginRight:'8px'}}/> AGENT DEV FORUM</h3>
              <button style={{background:'#0f172a', color:'white', padding:'10px 20px', borderRadius:'12px', border:'none', fontWeight:'bold', cursor:'pointer'}}>New Thread</button>
            </div>
            {[
              { t: 'DeepSeek-V3 MoE 레이어 최적화 기술 공유', u: 'Admin_SY', d: '2026.04.07', l: 452 },
              { t: 'AI + LLM 활용한 자동마케팅 파이프라인 구축', u: 'AutoGuru', d: '2026.04.07', l: 215 },
              { t: 'Ollama를 이용한 온디바이스 에이전트 실험', u: 'QuantDev', d: '2026.04.06', l: 189 },
            ].map((post, i) => (
              <div key={i} style={{padding:'25px', borderBottom:'1px solid #f8fafc', cursor:'pointer'}}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <h4 style={{fontSize:'17px', fontWeight:'bold'}}>{post.t}</h4>
                  <span style={{fontSize:'11px', color:'#cbd5e1', fontStyle:'italic'}}>{post.d}</span>
                </div>
                <div style={{marginTop:'10px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{fontSize:'12px', color:'#94a3b8'}}>by {post.u}</span>
                  <span style={{fontSize:'11px', fontWeight:'900', color:'#10b981'}}><Zap size={12} style={{display:'inline'}}/> {post.l} SYNCED</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 모달 */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 style={{fontWeight:'900', fontStyle:'italic'}}>EXPO REGISTRATION</h2>
            <p style={{margin:'20px 0', color:'#64748b'}}>2026 AI 에이전트 엑스포 신청을 진행하시겠습니까?</p>
            <div style={{display:'flex', gap:'10px', justifyContent:'flex-end'}}>
              <button onClick={() => setIsModalOpen(false)} style={{padding:'12px 24px', borderRadius:'12px', border:'none', cursor:'pointer'}}>취소</button>
              <button onClick={() => {alert("신청 완료!"); setIsModalOpen(false);}} className={styles.applyBtn}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;