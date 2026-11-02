import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Img from './Img';

// Shared split-screen layout for the Login and Sign Up pages
export default function AuthShell({ image, title, subtitle, children, side }) {
  return (
    <div className="auth">
      <aside className="auth-art">
        <Img src={image} alt="" loading="eager" />
        <div className="auth-shade" />
        <div className="auth-art-content">
          <Link to="/" className="brand light"><img src="/images/logo.svg" alt="" width="36" height="36" /><span>Property Manager</span></Link>
          <div className="auth-quote">
            <h2>{side.title}</h2>
            <ul>{side.points.map((p) => <li key={p}><CheckCircle2 size={18} /> {p}</li>)}</ul>
          </div>
        </div>
      </aside>
      <main className="auth-panel">
        <Link to="/" className="back-home"><ArrowLeft size={16} /> Back to home</Link>
        <div className="auth-card">
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
          {children}
        </div>
      </main>
    </div>
  );
}
