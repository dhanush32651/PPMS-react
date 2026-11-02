import { useState } from 'react';
import { Search, UserPlus, Eye, Trash2, Mail, Phone } from 'lucide-react';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLS, read, money, uid, today, fmtDate } from '../../utils/localStorage';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Tenants() {
  const { user } = useAuth();
  const toast = useToast();
  const [props, setProps] = useLS('properties');
  const [tenants, setTenants] = useLS('tenants');
  const [leases, setLeases] = useLS('leases');
  const [payments, setPayments] = useLS('payments');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [propF, setPropF] = useState('All');
  const [view, setView] = useState(null);
  const [adding, setAdding] = useState(false);
  const [del, setDel] = useState(null);
  const [f, setF] = useState({ name: '', email: '', phone: '', propertyId: '' });
  const [err, setErr] = useState('');

  const mine = props.filter((p) => p.ownerEmail === user.email);
  const ids = mine.map((p) => p.id);
  const pOf = (id) => props.find((p) => p.id === id);
  const rows = tenants.filter((t) => ids.includes(t.propertyId))
    .filter((t) => (status === 'All' || t.status === status) && (propF === 'All' || t.propertyId === propF) &&
      `${t.name} ${t.email} ${t.phone}`.toLowerCase().includes(q.toLowerCase()));
  const free = mine.filter((p) => p.status === 'Available');

  const pickUser = (email) => {
    const u = read('users', []).find((x) => x.role === 'tenant' && x.email.toLowerCase() === email.toLowerCase());
    setF((s) => ({ ...s, email, ...(u ? { name: u.name, phone: u.phone || '' } : {}) }));
  };

  const add = (e) => {
    e.preventDefault();
    if (!f.name.trim() || !/^\S+@\S+\.\S+$/.test(f.email) || !f.propertyId) return setErr('Enter a name, a valid email and choose a property.');
    if (tenants.some((t) => t.email.toLowerCase() === f.email.toLowerCase() && t.status === 'Active')) return setErr('This tenant is already assigned to a property.');
    const p = pOf(f.propertyId);
    const d = new Date();
    const end = new Date(d); end.setFullYear(end.getFullYear() + 1); end.setDate(end.getDate() - 1);
    setTenants([...tenants, { id: uid(), ownerEmail: user.email, name: f.name.trim(), email: f.email.trim(), phone: f.phone, propertyId: p.id, status: 'Active' }]);
    setLeases([...leases, { id: uid(), tenantEmail: f.email.trim(), tenantName: f.name.trim(), propertyId: p.id, start: today(), end: end.toISOString().slice(0, 10), rent: p.rent, deposit: p.rent * 3, status: 'Active' }]);
    setPayments([...payments, { id: uid(), tenantEmail: f.email.trim(), tenantName: f.name.trim(), propertyId: p.id, month: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, amount: p.rent, due: today(), date: null, status: 'Pending' }]);
    setProps(props.map((x) => (x.id === p.id ? { ...x, status: 'Rented' } : x)));
    toast(`${f.name} assigned to ${p.name}.`);
    setAdding(false); setErr(''); setF({ name: '', email: '', phone: '', propertyId: '' });
  };

  const remove = () => {
    setTenants(tenants.filter((t) => t.id !== del.id));
    setLeases(leases.filter((l) => !(l.tenantEmail === del.email && l.propertyId === del.propertyId)));
    setProps(props.map((x) => (x.id === del.propertyId ? { ...x, status: 'Available' } : x)));
    toast(`${del.name} removed.`);
    setDel(null);
  };

  const regTenants = read('users', []).filter((u) => u.role === 'tenant' && !tenants.some((t) => t.email === u.email && t.status === 'Active'));

  return (
    <>
      <div className="page-title">
        <div><h1>Manage Tenants</h1><p className="muted">{rows.length} tenant{rows.length === 1 ? '' : 's'}</p></div>
        <button className="btn btn-primary" onClick={() => setAdding(true)}><UserPlus size={16} /> Add tenant</button>
      </div>
      <div className="toolbar">
        <div className="search-box"><Search size={18} /><input placeholder="Search name, email, phone…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="All">All statuses</option><option>Active</option><option>Inactive</option></select>
        <select value={propF} onChange={(e) => setPropF(e.target.value)}><option value="All">All properties</option>{mine.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
      </div>
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>Tenant Name</th><th>Email</th><th>Contact Number</th><th>Assigned Property</th><th>Monthly Rent</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id}>
              <td><strong>{t.name}</strong></td><td>{t.email}</td><td>{t.phone || '—'}</td><td>{pOf(t.propertyId)?.name}</td><td>{money(pOf(t.propertyId)?.rent)}</td>
              <td><StatusBadge status={t.status} /></td>
              <td><div className="act-row"><button className="icon-btn sq" title="View" onClick={() => setView(t)}><Eye size={17} /></button><button className="icon-btn sq danger" title="Remove" onClick={() => setDel(t)}><Trash2 size={17} /></button></div></td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan="7" className="center muted">No tenants match your search.</td></tr>}
        </tbody>
      </table></div></div>

      <Modal open={!!view} onClose={() => setView(null)} title="Tenant details">
        {view && <div className="detail-list">
          <div className="avatar xl">{view.name.charAt(0)}</div>
          <h3>{view.name}</h3>
          <p><Mail size={16} /> {view.email}</p><p><Phone size={16} /> {view.phone || '—'}</p>
          <dl><dt>Property</dt><dd>{pOf(view.propertyId)?.name}, {pOf(view.propertyId)?.location}</dd>
            <dt>Monthly rent</dt><dd>{money(pOf(view.propertyId)?.rent)}</dd>
            <dt>Lease</dt><dd>{(() => { const l = leases.find((x) => x.tenantEmail === view.email && x.propertyId === view.propertyId); return l ? `${fmtDate(l.start)} – ${fmtDate(l.end)}` : '—'; })()}</dd>
            <dt>Status</dt><dd><StatusBadge status={view.status} /></dd></dl>
        </div>}
      </Modal>
      <Modal open={!!del} onClose={() => setDel(null)} title="Remove tenant?" footer={<><button className="btn btn-ghost" onClick={() => setDel(null)}>Cancel</button><button className="btn btn-danger" onClick={remove}>Remove</button></>}>
        <p>Remove <strong>{del?.name}</strong> and end their lease? The property will become available again.</p>
      </Modal>
      <Modal open={adding} onClose={() => setAdding(false)} title="Add tenant">
        <form onSubmit={add} noValidate className="stack">
          {err && <div className="alert error">{err}</div>}
          {regTenants.length > 0 && (
            <div className="field"><label>Registered tenants</label>
              <select value="" onChange={(e) => e.target.value && pickUser(e.target.value)}><option value="">Pick a registered tenant (optional)</option>{regTenants.map((u) => <option key={u.id} value={u.email}>{u.name} – {u.email}</option>)}</select></div>
          )}
          <div className="field"><label>Full name</label><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div className="grid-2">
            <div className="field"><label>Email</label><input value={f.email} onChange={(e) => pickUser(e.target.value)} /></div>
            <div className="field"><label>Phone</label><input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
          </div>
          <div className="field"><label>Assign property</label>
            <select value={f.propertyId} onChange={(e) => setF({ ...f, propertyId: e.target.value })}><option value="">Select an available property</option>{free.map((p) => <option key={p.id} value={p.id}>{p.name} – {money(p.rent)}</option>)}</select>
            {!free.length && <small className="err">No available properties. Add one or free up a rented property.</small>}</div>
          <button className="btn btn-primary btn-block">Assign tenant &amp; create lease</button>
        </form>
      </Modal>
    </>
  );
}
