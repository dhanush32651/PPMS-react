import { Printer } from 'lucide-react';
import NoProperty from '../../components/NoProperty';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { money, fmtDate } from '../../utils/localStorage';
import { getTenantData } from './helpers';
import { leaseStatus } from '../owner/Leases';

export default function MyLease() {
  const { user } = useAuth();
  const { property, owner, lease } = getTenantData(user.email);
  if (!property || !lease) return <><div className="page-title"><h1>My Lease</h1></div><NoProperty /></>;
  const rows = [
    ['Property Name', property.name], ['Owner Name', owner?.name || 'Property Owner'],
    ['Lease Start Date', fmtDate(lease.start)], ['Lease End Date', fmtDate(lease.end)],
    ['Monthly Rent', money(lease.rent)], ['Security Deposit', money(lease.deposit)],
  ];
  return (
    <>
      <div className="page-title"><div><h1>My Lease</h1><p className="muted">Your lease agreement details.</p></div>
        <button className="btn btn-ghost" onClick={() => window.print()}><Printer size={16} /> Print</button></div>
      <div className="card lease-card">
        <div className="lease-head"><div><small>Lease agreement</small><h2>{property.name}</h2><p>{property.location}</p></div><StatusBadge status={leaseStatus(lease)} /></div>
        <dl className="lease-grid">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}<div><dt>Lease Status</dt><dd><StatusBadge status={leaseStatus(lease)} /></dd></div></dl>
        <p className="muted">Tenant: {user.name} ({user.email})</p>
      </div>
    </>
  );
}
