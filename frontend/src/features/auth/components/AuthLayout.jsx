import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import '@/features/auth/styles/AuthLayout.css';

function AuthLayout({ title, description, asideTitle, asideDescription, footerText, footerLink, children }) {
  return (
    <div className="auth-layout">
      <section className="auth-layout__branding">
        <div className="auth-layout__logo">
          <Brain size={24} />
          <span>AGENT EXPO</span>
        </div>
        <p className="auth-layout__eyebrow">2026 GLOBAL EDITION</p>
        <h1>{asideTitle}</h1>
        <p className="auth-layout__description">{asideDescription}</p>
        <div className="auth-layout__highlights">
          <span>AI Agent Showcase</span>
          <span>Networking Lounge</span>
          <span>Developer Summit</span>
        </div>
      </section>

      <section className="auth-layout__panel">
        <div className="auth-layout__panel-header">
          <Link to="/" className="auth-layout__home-link">
            홈으로
          </Link>
          <p>{description}</p>
          <h2>{title}</h2>
        </div>

        {children}

        <p className="auth-layout__footer">
          {footerText} <Link to={footerLink.to}>{footerLink.label}</Link>
        </p>
      </section>
    </div>
  );
}

export default AuthLayout;
