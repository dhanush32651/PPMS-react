import { useState } from 'react';
import { CheckCircle2, Clock, AlertTriangle, BellRing } from 'lucide-react';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLS, money, fmtDate, today, uid } from '../../utils/localStorage';

export default function Payments() {
  const { user } = useAuth();
  const toast = useToast();
  const [props] = useLS('properties');
  const [payments, setPayments] = useLS('payments');
  const [messages, setMessages] = useLS('messages');
  const [filter, setFilter] = useState('All');

  const ids = props.filter((p) => p.ownerEmail === user.email).map((p) => p.id);
  const mine = payments.filter((p) => ids.includes(p.propertyId));
  const rows = mine.filter((p) => filter === 'All' || p.status === filter);
  const sum = (s) => mine.filter((p) => p.status === s).reduce((a, p) => a + p.amount, 0);
  const pname = (id) => props.find((p) => p.id === id)?.name;

  const markPaid = (p) => {
    setPayments(payments.map((x) => (x.id === p.id ? { ...x, status: 'Paid', date: today() } : x)));
    toast(`${p.month} rent from ${p.tenantName} marked as paid.`);
  };
  const remind = (p) => {
    setMessages([...messages, { id: uid(), from: user.email, fromName: user.name, to: p.tenantEmail, text: `Reminder: your rent of ${money(p.amount)} for ${p.month} is ${p.status.toLowerCase()}. Please pay at the earliest.`, time: new Date().toISOString() }]);
    toast(`Reminder sent to ${p.tenantName}.`, 'info');
  };

  return (
    <>
      <div className="page-title"><div><h1>Rental Payments</h1><p className="muted">Track rent collected, pending and overdue.</p></div></div>
      <div className="stats three">
        <StatCard icon={CheckCircle2} label="Total Collected" value={money(sum('Paid'))} tone="green" />
        <StatCard icon={Clock} label="Pending" value={money(sum('Pending'))} tone="amber" />
        <StatCard icon={AlertTriangle} label="Overdue" value={money(sum('Overdue'))} tone="red" />
      </div>
      <div className="tabs left">{['All', 'Paid', 'Pending', 'Overdue'].map((t) => <button key={t} className={filter === t ? 'on' : ''} onClick={() => setFilter(t)}>{t}</button>)}</div>
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>Tenant Name</th><th>Property Name</th><th>Payment Month</th><th>Amount</th><th>Payment Date</th><th>Payment Status</th><th>Actions</th></tr></thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id}>
              <td><strong>{p.tenantName}</strong></td><td>{pname(p.propertyId)}</td><td>{p.month}</td><td>{money(p.amount)}</td><td>{fmtDate(p.date)}</td>
              <td><StatusBadge status={p.status} /></td>
              <td>{p.status === 'Paid' ? <span className="muted">—</span> : (
                <div className="act-row"><button className="btn btn-accent btn-sm" onClick={() => markPaid(p)}>Mark paid</button><button className="btn btn-ghost btn-sm" onClick={() => remind(p)}><BellRing size={14} /> Remind</button></div>)}</td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan="7" className="center muted">No payments in this category.</td></tr>}
        </tbody>
      </table></div></div>
    </>
  );
}
