import '@/shared/styles/expo/ApplySection.css';

function ApplySection() {
  return (
    <section className="expo-apply">
      <div className="expo-apply__hero-group">
        <article className="expo-apply__hero-card">
          <span className="expo-apply__hero-chip">AI AGENT FESTIVAL</span>
          <h3>
            THE NEXT
            <br />
            INTELLIGENCE
          </h3>
          <p>LIVE: 2026.05.12 - 05.17</p>
        </article>

        <article className="expo-apply__text-card">
          <h3>
            AUTONOMOUS
            <br />
            <span>AGENT WORKFLOWS</span>
          </h3>
          <p>
            단순한 체험형 전시를 넘어, 실제로 계획하고 도구를 활용하며 업무를 수행하는
            에이전트 경험을 만나보세요.
          </p>
        </article>
      </div>

      <div className="expo-apply__info-group">
        <article className="expo-apply__progress-card">
          <p>REGISTRATION PROGRESS</p>
          <h3>NEURAL LINK: 94%</h3>
          <div>
            <div>
              <span>일반 컨퍼런스 패스</span>
              <strong>1,120 / 1,200</strong>
            </div>
            <div>
              <span>기업 전시 및 스폰서십</span>
              <strong>42 / 50</strong>
            </div>
          </div>
        </article>

        <article className="expo-apply__meta-card">
          <div>
            <p>DATE</p>
            <strong>2026.05.12 - 05.17</strong>
          </div>
          <div>
            <p>LOCATION</p>
            <strong>COEX GRAND BALLROOM</strong>
          </div>
        </article>
      </div>
    </section>
  );
}

export default ApplySection;
