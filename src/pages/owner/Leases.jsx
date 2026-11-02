import { useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLS, money, fmtDate, today } from '../../utils/localStorage';

export const leaseStatus = (l) => (l.status === 'Pending' ? 'Pending' : l.end < today() ? 'Expired' : 'Active');

export default function Leases() {
  const { user } = useAuth();
  const toast = useToast();
  const [props] = useLS('properties');
  const [leases, setLeases] = useLS('leases');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');

  const ids = props.filter((p) => p.ownerEmail === user.email).map((p) => p.id);
  const rows = leases.filter((l) => ids.includes(l.propertyId))
    .filter((l) => (status === 'All' || leaseStatus(l) === status) && l.tenantName.toLowerCase().includes(q.toLowerCase()));
  const pname = (id) => props.find((p) => p.id === id)?.name;

  const renew = (l) => {
    const base = new Date(l.end > today() ? l.end : today());
    base.setFullYear(base.getFullYear() + 1);
    setLeases(leases.map((x) => (x.id === l.id ? { ...x, end: base.toISOString().slice(0, 10), status: 'Active' } : x)));
    toast(`Lease for ${l.tenantName} renewed for 1 year.`);
  };

  return (
    <>
      <div className="page-title"><div><h1>Lease Management</h1><p className="muted">All lease agreements for your properties.</p></div></div>
      <div className="toolbar">
        <div className="search-box"><Search size={18} /><input placeholder="Search tenant…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="All">All statuses</option><option>Active</option><option>Expired</option><option>Pending</option></select>
      </div>
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>Tenant Name</th><th>Property Name</th><th>Lease Start Date</th><th>Lease End Date</th><th>Monthly Rent</th><th>Lease Status</th><th>Actions</th></tr></thead>
        <tbody>
          {rows.map((l) => (
            <tr key={l.id}>
              <td><strong>{l.tenantName}</strong></td><td>{pname(l.propertyId)}</td><td>{fmtDate(l.start)}</td><td>{fmtDate(l.end)}</td><td>{money(l.rent)}</td>
              <td><StatusBadge status={leaseStatus(l)} /></td>
              <td><button className="btn btn-ghost btn-sm" onClick={() => renew(l)}><RefreshCw size={14} /> Renew 1 yr</button></td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan="7" className="center muted">No leases found.</td></tr>}
        </tbody>
      </table></div></div>
    </>
  );
}
