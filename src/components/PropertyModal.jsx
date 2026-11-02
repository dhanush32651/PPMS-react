import { useState, useEffect } from 'react';
import { MapPin, BedDouble, Bath, Maximize, Check, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import Modal from './Modal';
import Img from './Img';
import StatusBadge from './StatusBadge';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { money, read, write, uid } from '../utils/localStorage';

export default function PropertyModal({ property, onClose, showEnquiry = true }) {
  const [idx, setIdx] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [err, setErr] = useState('');
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    setIdx(0);
    setErr('');
    setForm({ name: user?.name || '', email: user?.email || '', message: '' });
  }, [property, user]);

  if (!property) return null;
  const imgs = (property.images || []).filter(Boolean);
  const go = (d) => setIdx((i) => (i + d + imgs.length) % imgs.length);

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) return setErr('Please enter your name and a valid email address.');
    write('enquiries', [...read('enquiries', []), { id: uid(), propertyId: property.id, ...form, time: new Date().toISOString() }]);
    toast('Enquiry sent! The owner will contact you soon.');
    setForm({ ...form, message: '' });
    setErr('');
  };

  return (
    <Modal open={!!property} onClose={onClose} title={property.name} wide>
      <div className="pm-grid">
        <div>
          <div className="gallery-main">
            <Img key={idx} src={imgs[idx]} alt={`${property.name} photo ${idx + 1}`} />
            {imgs.length > 1 && (
              <>
                <button className="g-arrow left" onClick={() => go(-1)} aria-label="Previous photo"><ChevronLeft /></button>
                <button className="g-arrow right" onClick={() => go(1)} aria-label="Next photo"><ChevronRight /></button>
              </>
            )}
            <span className="g-count">{idx + 1} / {imgs.length}</span>
          </div>
          <div className="thumbs">
            {imgs.map((s, i) => (
              <button key={i} className={i === idx ? 'on' : ''} onClick={() => setIdx(i)} aria-label={`Photo ${i + 1}`}>
                <Img src={s} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="pm-info">
          <div className="row between">
            <StatusBadge status={property.status} />
            <span className="badge gray">{property.type}</span>
          </div>
          <p className="price big">{money(property.rent)}<small>/month</small></p>
          <p className="muted loc"><MapPin size={16} /> {property.location}</p>
          <div className="spec-row">
            {property.type !== 'Commercial' && <span><BedDouble size={16} /> {property.beds} Bedrooms</span>}
            <span><Bath size={16} /> {property.baths} Bathrooms</span>
            {property.area ? <span><Maximize size={16} /> {property.area} sq ft</span> : null}
          </div>
          <p className="desc">{property.description}</p>
          {property.amenities?.length > 0 && (
            <div className="amen">
              {property.amenities.map((a) => <span key={a}><Check size={14} /> {a}</span>)}
            </div>
          )}
        </div>
      </div>
      {showEnquiry && (
        <form className="enquiry" onSubmit={submit} noValidate>
          <h4>Interested? Send an enquiry</h4>
          {err && <p className="form-error">{err}</p>}
          <div className="grid-2">
            <input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <textarea rows="2" placeholder="Message (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button className="btn btn-accent"><Send size={16} /> Send enquiry</button>
        </form>
      )}
    </Modal>
  );
}
