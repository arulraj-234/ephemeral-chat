import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Home = () => {
  return (
    <div className="gradient">
      <div className="container">
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
          <ThemeToggle />
        </div>

        <header style={{ textAlign: 'center', padding: '2rem 1rem 1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ margin: '0 auto', display: 'block' }}>
              <circle cx="28" cy="28" r="26" stroke="var(--accent-blue)" strokeWidth="2" strokeDasharray="6 4" opacity="0.6"/>
              <circle cx="28" cy="28" r="18" fill="var(--accent-blue)" opacity="0.15"/>
              <path d="M20 20L36 36M36 20L20 36" stroke="var(--accent-blue)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-0.03em' }}>
            Ephemeral Chat
          </h1>
          <p className="subtitle" style={{ maxWidth: '480px', margin: '0 auto 1.5rem', fontSize: '0.9375rem' }}>
            Secure, temporary conversations. No registration, no tracking, no trace.
          </p>

          <div className="action-buttons" style={{ gap: '1rem', marginBottom: '2rem' }}>
            <Link to="/create-room" className="btn btn-primary" style={{ minWidth: '160px' }}>
              Create Room
            </Link>
            <Link to="/join-room" className="btn btn-secondary" style={{ minWidth: '160px' }}>
              Join Room
            </Link>
          </div>
        </header>

        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem 0.75rem' }}>
          <div className="feature-grid" style={{ gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div className="feature-card" style={{ display: 'flex', gap: '1rem', padding: '1.25rem', textAlign: 'left' }}>
              <div style={{ flexShrink: 0 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-blue-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>End-to-End Privacy</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                  Messages exist only in memory. No databases, no logs, no persistence.
                </p>
              </div>
            </div>

            <div className="feature-card" style={{ display: 'flex', gap: '1rem', padding: '1.25rem', textAlign: 'left' }}>
              <div style={{ flexShrink: 0 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-blue-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Real-Time Messaging</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                  Instant delivery via WebSocket. See messages as they arrive.
                </p>
              </div>
            </div>

            <div className="feature-card" style={{ display: 'flex', gap: '1rem', padding: '1.25rem', textAlign: 'left' }}>
              <div style={{ flexShrink: 0 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-blue-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Truly Temporary</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                  Close the room and everything disappears forever. No recovery.
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <span>🔒 Zero data retention</span>
              <span>⚡ WebSocket powered</span>
              <span>🚫 No tracking</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
