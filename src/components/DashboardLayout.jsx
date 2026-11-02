import { useState, useMemo } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Building2, PlusSquare, Users, IndianRupee, FileText, MessageSquare,
  Home, Wallet, Menu, Bell,
} from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { read, money } from '../utils/localStorage';

const OWNER_LINKS = [
  { to: '/owner', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/owner/properties', label: 'My Properties', icon: Building2 },
  { to: '/owner/properties/new', label: 'Add Property', icon: PlusSquare },
  { to: '/owner/tenants', label: 'Manage Tenants', icon: Users },
  { to: '/owner/payments', label: 'Rental Payments', icon: IndianRupee },
  { to: '/owner/leases', label: 'Lease Management', icon: FileText },
  { to: '/owner/messages', label: 'Messages', icon: MessageSquare },
];
const TENANT_LINKS = [
  { to: '/tenant', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tenant/property', label: 'My Property', icon: Home },
  { to: '/tenant/payments', label: 'Payments', icon: Wallet },
  { to: '/tenant/lease', label: 'My Lease', icon: FileText },
  { to: '/tenant/messages', label: 'Messages', icon: MessageSquare },
];

export default function DashboardLayout({ role }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [bell, setBell] = useState(false);

  const notes = useMemo(() => {
    if (!bell) return [];
    const props = read('properties', []);
    const pays = read('payments', []);
    const msgs = read('messages', []);
    const out = [];
    if (role === 'owner') {
      const ids = props.filter((p) => p.ownerEmail === user.email).map((p) => p.id);
      pays.filter((p) => ids.includes(p.propertyId) && p.status !== 'Paid')
        .forEach((p) => out.push(`${p.tenantName}: ${p.month} rent (${money(p.amount)}) is ${p.status.toLowerCase()}`));
      msgs.filter((m) => m.to === user.email).slice(-3).forEach((m) => out.push(`New message from ${m.fromName}`));
    } else {
      pays.filter((p) => p.tenantEmail === user.email && p.status !== 'Paid')
        .forEach((p) => out.push(`${p.month} rent of ${money(p.amount)} is ${p.status.toLowerCase()}`));
      msgs.filter((m) => m.to === user.email).slice(-3).forEach((m) => out.push(`New message from ${m.fromName}`));
    }
    return out.length ? out : ['You are all caught up.'];
  }, [bell, role, user]);

  const doLogout = () => { logout(); nav('/'); };

  return (
    <div className={`dash ${role}`}>
      <Sidebar role={role} links={role === 'owner' ? OWNER_LINKS : TENANT_LINKS} open={open} onClose={() => setOpen(false)} onLogout={doLogout} />
      <div className="dash-main">
        <header className="topbar">
          <button className="icon-btn side-toggle" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
          <Link to="/explore" className="top-link">Browse listings</Link>
          <div className="top-right">
            <div className="bell-wrap">
              <button className="icon-btn" onClick={() => setBell(!bell)} aria-label="Notifications">
                <Bell size={20} /><span className="dot" />
              </button>
              {bell && (
                <div className="bell-menu">
                  <h5>Notifications</h5>
                  {notes.map((n, i) => <p key={i}>{n}</p>)}
                </div>
              )}
            </div>
            <div className="profile">
              <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
              <div className="who"><strong>{user.name}</strong><small>{role === 'owner' ? 'Property Owner' : 'Tenant'}</small></div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={doLogout}>Logout</button>
          </div>
        </header>
        <main className="dash-content"><Outlet /></main>
      </div>
    </div>
  );
}
