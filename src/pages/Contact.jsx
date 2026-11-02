import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToast } from '../context/ToastContext';
import { read, write, uid } from '../utils/localStorage';

export default function Contact() {
  const [f, setF] = useState({ name: '', email: '', subject: '', message: '' });
  const [err, setErr] = useState({});
  const toast = useToast();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.name.trim()) er.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email address.';
    if (f.message.trim().length < 10) er.message = 'Message should be at least 10 characters.';
    setErr(er);
    if (Object.keys(er).length) return;
    write('contacts', [...read('contacts', []), { id: uid(), ...f, time: new Date().toISOString() }]);
    toast('Message sent. We will get back to you shortly.');
    setF({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <Navbar solid />
      <section className="page-hero"><div className="container"><h1>Contact Us</h1><p>Questions or feedback? We would love to hear from you.</p></div></section>
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-info">
            <div><Mail /><div><h4>Email</h4><p>hello@propertymanager.in</p></div></div>
            <div><Phone /><div><h4>Phone</h4><p>+91 98765 43210</p></div></div>
            <div><MapPin /><div><h4>Office</h4><p>Hyderabad, Telangana, India</p></div></div>
            <div><Clock /><div><h4>Hours</h4><p>Mon–Sat, 9:00 AM – 6:00 PM</p></div></div>
          </div>
          <form className="card form-card" onSubmit={submit} noValidate>
            <h3>Send us a message</h3>
            <div className="grid-2">
              <div className="field"><label>Name</label><input value={f.name} onChange={set('name')} />{err.name && <small className="err">{err.name}</small>}</div>
              <div className="field"><label>Email</label><input value={f.email} onChange={set('email')} />{err.email && <small className="err">{err.email}</small>}</div>
            </div>
            <div className="field"><label>Subject</label><input value={f.subject} onChange={set('subject')} /></div>
            <div className="field"><label>Message</label><textarea rows="5" value={f.message} onChange={set('message')} />{err.message && <small className="err">{err.message}</small>}</div>
            <button className="btn btn-primary"><Send size={16} /> Send message</button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}
