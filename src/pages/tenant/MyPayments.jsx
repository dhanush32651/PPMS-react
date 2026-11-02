import { useState } from 'react';
import { CheckCircle2, Clock, CreditCard } from 'lucide-react';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLS, money, fmtDate, today } from '../../utils/localStorage';

export default function MyPayments() {
  const { user } = useAuth();
  const toast = useToast();
  const [all, setAll] = useLS('payments');
  const [props] = useLS('properties');
  const [paying, setPaying] = useState(null);

  // tenants only ever see their own rows
  const mine = all.filter((p) => p.tenantEmail.toLowerCase() === user.email.toLowerCase());
  const paid = mine.filter((p) => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const due = mine.filter((p) => p.status !== 'Paid').reduce((s, p) => s + p.amount, 0);

  const confirm = () => {
    setAll(all.map((x) => (x.id === paying.id ? { ...x, status: 'Paid', date: today() } : x)));
    toast(`Payment of ${money(paying.amount)} recorded. Thank you!`);
    setPaying(null);
  };

  return (
    <>
      <div className="page-title"><div><h1>My Payments</h1><p className="muted">Your rent payment history.</p></div></div>
      <div className="stats three">
        <StatCard icon={CheckCircle2} label="Total Paid" value={money(paid)} tone="green" />
        <StatCard icon={Clock} label="Pending Amount" value={money(due)} tone="amber" />
        <StatCard icon={CreditCard} label="Payments Made" value={mine.filter((p) => p.status === 'Paid').length} tone="blue" />
      </div>
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>Payment Month</th><th>Property Name</th><th>Amount</th><th>Payment Date</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {mine.map((p) => (
            <tr key={p.id}>
              <td><strong>{p.month}</strong></td><td>{props.find((x) => x.id === p.propertyId)?.name}</td><td>{money(p.amount)}</td><td>{fmtDate(p.date)}</td>
              <td><StatusBadge status={p.status} /></td>
              <td>{p.status !== 'Paid' && <button className="btn btn-accent btn-sm" onClick={() => setPaying(p)}>Pay now</button>}</td>
            </tr>
          ))}
          {!mine.length && <tr><td colSpan="6" className="center muted">No payments yet.</td></tr>}
        </tbody>
      </table></div></div>
      <Modal open={!!paying} onClose={() => setPaying(null)} title="Confirm payment" footer={<><button className="btn btn-ghost" onClick={() => setPaying(null)}>Cancel</button><button className="btn btn-accent" onClick={confirm}>Pay {money(paying?.amount)}</button></>}>
        <p>You are paying rent for <strong>{paying?.month}</strong>.</p>
        <p className="muted">This is a demonstration – no real money is transferred. The payment will be marked as paid.</p>
      </Modal>
    </>
  );
}
