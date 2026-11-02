import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NoProperty() {
  return (
    <div className="empty">
      <Home size={42} />
      <h3>No property assigned yet</h3>
      <p>Your owner will link you to a property using your registered email address. Meanwhile, you can browse available listings.</p>
      <Link to="/explore" className="btn btn-primary">Browse properties</Link>
    </div>
  );
}
