import { NavLink, Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function Sidebar({ links, open, onClose, onLogout, role }) {
  return (
    <>
      <aside className={`sidebar ${role} ${open ? 'open' : ''}`}>
        <Link to="/" className="brand light" onClick={onClose}>
          <img src="/images/logo.svg" alt="" width="34" height="34" />
          <span>Property Manager</span>
        </Link>
        <p className="side-label">{role === 'owner' ? 'Owner Console' : 'Tenant Portal'}</p>
        <nav>
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={onClose}>
              <Icon size={19} /> {label}
            </NavLink>
          ))}
        </nav>
        <button className="side-logout" onClick={onLogout}><LogOut size={19} /> Logout</button>
      </aside>
      {open && <div className="side-overlay" onClick={onClose} />}
    </>
  );
}
