export default function StatCard({ icon: Icon, label, value, hint, tone = 'blue' }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="stat-label">{label}</p>
        <h3 className="stat-value">{value}</h3>
        {hint && <p className="stat-hint">{hint}</p>}
      </div>
    </div>
  );
}
