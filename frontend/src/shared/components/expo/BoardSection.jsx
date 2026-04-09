import { Terminal, Zap } from 'lucide-react';
import '@/shared/styles/expo/BoardSection.css';

function BoardSection({ boardPosts }) {
  return (
    <section className="expo-board">
      <div className="expo-board__header">
        <h3>
          <Terminal size={20} />
          AGENT DEV FORUM
        </h3>
        <button type="button">New Thread</button>
      </div>

      <div className="expo-board__list">
        {boardPosts.map((post) => (
          <article key={`${post.title}-${post.date}`} className="expo-board__item">
            <div className="expo-board__title-row">
              <h4>{post.title}</h4>
              <span>{post.date}</span>
            </div>
            <div className="expo-board__meta-row">
              <span>by {post.user}</span>
              <strong>
                <Zap size={12} />
                {post.likes} SYNCED
              </strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default BoardSection;
