import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand light"><img src="/images/logo.svg" alt="" width="34" height="34" /><span>Property Manager</span></div>
          <p>One simple platform to manage properties, tenants, rental payments and lease information.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/explore">Explore Properties</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign Up</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <p><MapPin size={15} /> Hyderabad, Telangana, India</p>
          <p><Phone size={15} /> +91 98765 43210</p>
          <p><Mail size={15} /> hello@propertymanager.in</p>
        </div>
      </div>
      <div className="container copy">© {new Date().getFullYear()} Property Manager. A B.Tech CSE academic project.</div>
    </footer>
  );
}
