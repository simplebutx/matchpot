import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import '@/shared/styles/expo/DashboardSection.css';

function DashboardSection({ stats, inferenceData }) {
  return (
    <section className="expo-dashboard">
      <div className="expo-dashboard__stats">
        {stats.map((item) => (
          <article key={item.label} className="expo-dashboard__stat-card">
            <p>{item.label}</p>
            <div>
              <h4>{item.value}</h4>
              <span>{item.change}</span>
            </div>
          </article>
        ))}
      </div>

      <article className="expo-dashboard__chart-card">
        <h3>
          <TrendingUp size={20} />
          네트워크 트래픽 추이 분석
        </h3>
        <div className="expo-dashboard__chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={inferenceData}>
              <XAxis dataKey="name" hide />
              <Tooltip />
              <Area type="monotone" dataKey="pv" stroke="#4f46e5" fill="#eef2ff" strokeWidth={4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}

export default DashboardSection;
