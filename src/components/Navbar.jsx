import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ solid = false }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const close = () => setOpen(false);
  const links = [
    ['/', 'Home'],
    ['/explore', 'Explore Properties'],
    ['/about', 'About Us'],
    ['/contact', 'Contact'],
  ];

  return (
    <header className={`navbar ${scrolled || solid || open ? 'solid' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={close}>
          <img src="/images/logo.svg" alt="" width="34" height="34" />
          <span>Property Manager</span>
        </Link>
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={close}>{label}</NavLink>
          ))}
          <div className="nav-cta">
            {user ? (
              <>
                <Link to={`/${user.role}`} className="btn btn-ghost btn-sm" onClick={close}><LayoutDashboard size={16} /> Dashboard</Link>
                <button className="btn btn-primary btn-sm" onClick={() => { logout(); close(); nav('/'); }}><LogOut size={16} /> Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm" onClick={close}>Login</Link>
                <Link to="/register" className="btn btn-accent btn-sm" onClick={close}>Sign Up</Link>
              </>
            )}
          </div>
        </nav>
        <button className="icon-btn menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
