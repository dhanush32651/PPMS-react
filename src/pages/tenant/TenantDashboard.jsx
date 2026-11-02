import { Link } from 'react-router-dom';
import { Home, IndianRupee, CalendarClock, FileCheck2, Wallet, FileText, MessageSquare } from 'lucide-react';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import NoProperty from '../../components/NoProperty';
import Img from '../../components/Img';
import { useAuth } from '../../context/AuthContext';
import { money, fmtDate } from '../../utils/localStorage';
import { getTenantData } from './helpers';
import { leaseStatus } from '../owner/Leases';

export default function TenantDashboard() {
  const { user } = useAuth();
  const { property, lease, payments } = getTenantData(user.email);
  const next = payments.filter((p) => p.status !== 'Paid').sort((a, b) => a.due.localeCompare(b.due))[0];

  return (
    <>
      <div className="welcome-banner">
        <div><h1>Welcome, {user.name}!</h1><p>Here is a summary of your tenancy.</p></div>
        <div className="quick-row">
          <Link to="/tenant/payments" className="btn btn-accent"><Wallet size={16} /> Pay rent</Link>
          <Link to="/tenant/lease" className="btn btn-outline-light"><FileText size={16} /> View lease</Link>
          <Link to="/tenant/messages" className="btn btn-outline-light"><MessageSquare size={16} /> Message owner</Link>
        </div>
      </div>
      {!property ? <NoProperty /> : (
        <>
          <div className="stats">
            <StatCard icon={Home} label="Assigned Property" value={property.name} tone="blue" hint={property.location} />
            <StatCard icon={IndianRupee} label="Monthly Rent" value={money(property.rent)} tone="navy" />
            <StatCard icon={CalendarClock} label="Next Payment Due" value={next ? fmtDate(next.due) : 'All paid'} tone="amber" hint={next ? `${next.month} · ${next.status}` : 'No dues'} />
            <StatCard icon={FileCheck2} label="Lease Status" value={lease ? leaseStatus(lease) : '—'} tone="green" hint={lease ? `Ends ${fmtDate(lease.end)}` : ''} />
          </div>
          <div className="dash-grid">
            <div className="card prop-summary">
              <Img src={property.images?.[0]} alt={property.name} />
              <div><h3>{property.name}</h3><p className="muted">{property.location} · {property.type}</p>
                <p>{property.type === 'Commercial' ? '' : `${property.beds} Beds · `}{property.baths} Baths · {property.area} sq ft</p>
                <Link to="/tenant/property" className="btn btn-primary btn-sm">View property</Link></div>
            </div>
            <div className="card">
              <div className="card-head"><h3>Recent payment history</h3><Link to="/tenant/payments">View all</Link></div>
              <div className="table-wrap"><table>
                <thead><tr><th>Month</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>{[...payments].reverse().slice(0, 5).map((p) => <tr key={p.id}><td>{p.month}</td><td>{money(p.amount)}</td><td><StatusBadge status={p.status} /></td></tr>)}</tbody>
              </table></div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
