import '@/shared/styles/expo/VoteSection.css';

function VoteSection({ voteItems }) {
  return (
    <section className="expo-vote">
      {voteItems.map((item) => {
        const Icon = item.icon;
        return (
          <article key={item.name} className="expo-vote__card">
            <div className="expo-vote__card-top">
              <span className="expo-vote__icon" style={{ color: item.color }}>
                <Icon size={34} />
              </span>
              <span className="expo-vote__chip">VOTE</span>
            </div>
            <h4>{item.name}</h4>
            <div className="expo-vote__bar">
              <div style={{ width: `${(item.votes / 2500) * 100}%`, backgroundColor: item.color }} />
            </div>
            <p>{item.votes.toLocaleString()} NEURAL SYNCED</p>
          </article>
        );
      })}
    </section>
  );
}

export default VoteSection;
