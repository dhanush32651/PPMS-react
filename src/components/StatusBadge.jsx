const map = {
  Available: 'green', Paid: 'green', Active: 'green',
  Rented: 'blue', Pending: 'amber',
  Overdue: 'red', Expired: 'red', Inactive: 'gray',
};
export default function StatusBadge({ status }) {
  return <span className={`badge ${map[status] || 'gray'}`}>{status}</span>;
}
