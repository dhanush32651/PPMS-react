import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, UserCog } from 'lucide-react';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const [f, setF] = useState({ email: '', password: '', role: 'owner' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [errs, setErrs] = useState({});

  if (user) return <Navigate to={`/${user.role}`} replace />;
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setError(''); };

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email address.';
    if (!f.password) er.password = 'Enter your password.';
    setErrs(er);
    if (Object.keys(er).length) return;
    const res = login(f.email, f.password, f.role);
    if (!res.ok) return setError(res.error);
    toast(`Welcome back, ${res.user.name}!`);
    nav(`/${res.user.role}`, { replace: true });
  };
  const demo = (role) => setF({ email: role === 'owner' ? 'owner@example.com' : 'rahul@example.com', password: '123456', role });

  return (
    <AuthShell
      image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"
      title="Welcome back"
      subtitle="Log in to manage your properties or view your tenancy."
      side={{ title: 'Everything about your property, one login away.', points: ['Track rent and pending payments', 'Manage leases and tenants', 'Message owners and tenants'] }}
    >
      {error && <div className="alert error">{error}</div>}
      <form onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="email">Email address</label>
          <div className="input-icon"><Mail size={18} /><input id="email" type="email" placeholder="you@example.com" value={f.email} onChange={set('email')} autoComplete="email" /></div>
          {errs.email && <small className="err">{errs.email}</small>}
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <div className="input-icon"><Lock size={18} />
            <input id="password" type={show ? 'text' : 'password'} placeholder="Enter your password" value={f.password} onChange={set('password')} autoComplete="current-password" />
            <button type="button" className="eye" onClick={() => setShow(!show)} aria-label="Show password">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          {errs.password && <small className="err">{errs.password}</small>}
        </div>
        <div className="field">
          <label htmlFor="role">Login as</label>
          <div className="input-icon"><UserCog size={18} />
            <select id="role" value={f.role} onChange={set('role')}><option value="owner">Owner</option><option value="tenant">Tenant</option></select>
          </div>
        </div>
        <button className="btn btn-primary btn-block btn-lg"><LogIn size={18} /> Login</button>
        <Link to="/register" className="btn btn-ghost btn-block">Create an Account</Link>
      </form>
      <div className="demo-box">
        <p>Try a demo account</p>
        <div><button type="button" onClick={() => demo('owner')}>Fill owner login</button><button type="button" onClick={() => demo('tenant')}>Fill tenant login</button></div>
      </div>
    </AuthShell>
  );
}
