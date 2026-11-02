import { Link } from 'react-router-dom';
import { Building2, Users, IndianRupee, Clock, PlusSquare, MessageSquare, FileText, Activity } from 'lucide-react';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import Img from '../../components/Img';
import { useAuth } from '../../context/AuthContext';
import { read, money, fmtDate, fmtTime } from '../../utils/localStorage';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const props = read('properties', []).filter((p) => p.ownerEmail === user.email);
  const ids = props.map((p) => p.id);
  const tenants = read('tenants', []).filter((t) => ids.includes(t.propertyId));
  const pays = read('payments', []).filter((p) => ids.includes(p.propertyId));
  const msgs = read('messages', []).filter((m) => m.to === user.email || m.from === user.email);
  const income = tenants.filter((t) => t.status === 'Active').reduce((s, t) => s + (props.find((p) => p.id === t.propertyId)?.rent || 0), 0);
  const pending = pays.filter((p) => p.status !== 'Paid').reduce((s, p) => s + p.amount, 0);
  const pname = (id) => props.find((p) => p.id === id)?.name || '—';

  const activity = [
    ...pays.filter((p) => p.date).map((p) => ({ t: p.date, text: `${p.tenantName} paid ${money(p.amount)} for ${p.month}` })),
    ...msgs.filter((m) => m.to === user.email).map((m) => ({ t: m.time, text: `Message from ${m.fromName}` })),
  ].sort((a, b) => new Date(b.t) - new Date(a.t)).slice(0, 5);

  return (
    <>
      <div className="page-title"><div><h1>Welcome, {user.name} 👋</h1><p className="muted">Here is what is happening across your properties.</p></div></div>
      <div className="stats">
        <StatCard icon={Building2} label="Total Properties" value={props.length} tone="blue" hint={`${props.filter((p) => p.status === 'Available').length} available`} />
        <StatCard icon={Users} label="Total Tenants" value={tenants.length} tone="green" />
        <StatCard icon={IndianRupee} label="Monthly Rental Income" value={money(income)} tone="navy" />
        <StatCard icon={Clock} label="Pending Payments" value={money(pending)} tone="amber" hint={`${pays.filter((p) => p.status !== 'Paid').length} unpaid`} />
      </div>

      <div className="card quick">
        <h3>Quick actions</h3>
        <div>
          <Link to="/owner/properties/new" className="btn btn-primary"><PlusSquare size={16} /> Add property</Link>
          <Link to="/owner/tenants" className="btn btn-ghost"><Users size={16} /> Manage tenants</Link>
          <Link to="/owner/payments" className="btn btn-ghost"><IndianRupee size={16} /> Record payments</Link>
          <Link to="/owner/leases" className="btn btn-ghost"><FileText size={16} /> View leases</Link>
          <Link to="/owner/messages" className="btn btn-ghost"><MessageSquare size={16} /> Messages</Link>
        </div>
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="card-head"><h3>Property overview</h3><Link to="/owner/properties">View all</Link></div>
          <ul className="mini-list">
            {props.slice(0, 5).map((p) => (
              <li key={p.id}><Img src={p.images?.[0]} alt="" /><div><strong>{p.name}</strong><small>{p.location} · {money(p.rent)}/mo</small></div><StatusBadge status={p.status} /></li>
            ))}
            {!props.length && <p className="muted">No properties yet.</p>}
          </ul>
        </div>
        <div className="card">
          <div className="card-head"><h3>Tenant overview</h3><Link to="/owner/tenants">View all</Link></div>
          <ul className="mini-list">
            {tenants.slice(0, 5).map((t) => (
              <li key={t.id}><span className="avatar">{t.name.charAt(0)}</span><div><strong>{t.name}</strong><small>{pname(t.propertyId)}</small></div><StatusBadge status={t.status} /></li>
            ))}
            {!tenants.length && <p className="muted">No tenants yet.</p>}
          </ul>
        </div>
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="card-head"><h3>Recent rental payments</h3><Link to="/owner/payments">View all</Link></div>
          <div className="table-wrap"><table>
            <thead><tr><th>Tenant</th><th>Month</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>{pays.slice(-5).reverse().map((p) => <tr key={p.id}><td>{p.tenantName}</td><td>{p.month}</td><td>{money(p.amount)}</td><td><StatusBadge status={p.status} /></td></tr>)}</tbody>
          </table></div>
        </div>
        <div className="card">
          <div className="card-head"><h3><Activity size={18} /> Recent activity</h3></div>
          <ul className="timeline">
            {activity.map((a, i) => <li key={i}><span /><div><p>{a.text}</p><small>{fmtDate(a.t)}</small></div></li>)}
            {!activity.length && <p className="muted">No activity yet.</p>}
          </ul>
        </div>
      </div>
    </>
  );
}
