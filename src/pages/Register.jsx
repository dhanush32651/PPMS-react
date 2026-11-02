import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, Building2, Home } from 'lucide-react';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const { user, register } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', confirm: '', role: 'tenant' });
  const [show, setShow] = useState(false);
  const [errs, setErrs] = useState({});
  const [error, setError] = useState('');

  if (user) return <Navigate to={`/${user.role}`} replace />;
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setError(''); };

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email address.';
    if (f.phone && !/^[0-9+\-\s]{7,15}$/.test(f.phone)) er.phone = 'Enter a valid phone number.';
    if (f.password.length < 6) er.password = 'Password must be at least 6 characters.';
    if (f.confirm !== f.password) er.confirm = 'Passwords do not match.';
    setErrs(er);
    if (Object.keys(er).length) return;
    const res = register(f);
    if (!res.ok) return setError(res.error);
    toast('Account created! Please log in.');
    nav('/login');
  };

  const Field = ({ id, label, icon: I, type = 'text', placeholder, optional }) => (
    <div className="field">
      <label htmlFor={id}>{label}{optional && <span className="opt"> (optional)</span>}</label>
      <div className="input-icon"><I size={18} />
        <input id={id} type={id === 'password' || id === 'confirm' ? (show ? 'text' : 'password') : type} placeholder={placeholder} value={f[id]} onChange={set(id)} />
        {id === 'password' && <button type="button" className="eye" onClick={() => setShow(!show)} aria-label="Show password">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
      </div>
      {errs[id] && <small className="err">{errs[id]}</small>}
    </div>
  );

  return (
    <AuthShell
      image="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80"
      title="Create your account"
      subtitle="Join as an owner to list properties, or as a tenant to manage your tenancy."
      side={{ title: 'Start managing smarter in a minute.', points: ['Free to create an account', 'Separate Owner and Tenant portals', 'Your data stays in your browser'] }}
    >
      {error && <div className="alert error">{error}</div>}
      <form onSubmit={submit} noValidate>
        <div className="role-pick">
          <button type="button" className={f.role === 'owner' ? 'on' : ''} onClick={() => setF({ ...f, role: 'owner' })}><Building2 size={22} /><strong>Owner</strong><small>Manage properties</small></button>
          <button type="button" className={f.role === 'tenant' ? 'on' : ''} onClick={() => setF({ ...f, role: 'tenant' })}><Home size={22} /><strong>Tenant</strong><small>View my tenancy</small></button>
        </div>
        {Field({ id: 'name', label: 'Full name', icon: User, placeholder: 'Rahul Kumar' })}
        {Field({ id: 'email', label: 'Email address', icon: Mail, type: 'email', placeholder: 'you@example.com' })}
        {Field({ id: 'phone', label: 'Phone number', icon: Phone, type: 'tel', placeholder: '98765 43210', optional: true })}
        <div className="grid-2">
          {Field({ id: 'password', label: 'Password', icon: Lock, placeholder: 'Min. 6 characters' })}
          {Field({ id: 'confirm', label: 'Confirm password', icon: Lock, placeholder: 'Repeat password' })}
        </div>
        <button className="btn btn-accent btn-block btn-lg"><UserPlus size={18} /> Create account</button>
        <p className="switch">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </AuthShell>
  );
}
