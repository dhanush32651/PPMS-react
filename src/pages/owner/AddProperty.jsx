import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import Img from '../../components/Img';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { read, write, uid } from '../../utils/localStorage';

const EMPTY = { name: '', type: 'Villa', location: '', rent: '', beds: 2, baths: 2, area: '', description: '', status: 'Available', images: ['', '', '', ''] };

export default function AddProperty() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const [f, setF] = useState(EMPTY);
  const [errs, setErrs] = useState({});

  useEffect(() => {
    if (!id) {
      setF(EMPTY);
      return;
    }
    const p = read('properties', []).find((x) => x.id === id && x.ownerEmail === user.email);
    if (!p) { toast('Property not found.', 'error'); nav('/owner/properties'); return; }
    setF({ ...p, images: [...(p.images || []), '', '', '', ''].slice(0, 4) });
  }, [id]); // eslint-disable-line

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const setImg = (i) => (e) => setF({ ...f, images: f.images.map((x, j) => (j === i ? e.target.value : x)) });

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.name.trim()) er.name = 'Enter the property name.';
    if (!f.location.trim()) er.location = 'Enter the location.';
    if (!(Number(f.rent) > 0)) er.rent = 'Enter a monthly rent greater than 0.';
    if (!f.description.trim()) er.description = 'Add a short description.';
    if (!f.images[0].trim()) er.image = 'Add at least the main image URL.';
    setErrs(er);
    if (Object.keys(er).length) return;
    const clean = {
      ...f, name: f.name.trim(), location: f.location.trim(), rent: Number(f.rent),
      beds: f.type === 'Commercial' ? 0 : Number(f.beds), baths: Number(f.baths), area: Number(f.area) || 0,
      images: f.images.map((s) => s.trim()).filter(Boolean),
    };
    const all = read('properties', []);
    if (id) {
      write('properties', all.map((p) => (p.id === id ? { ...p, ...clean } : p)));
      toast('Property updated.');
    } else {
      write('properties', [...all, { ...clean, id: uid(), ownerEmail: user.email, featured: false, amenities: ['Parking', 'Water supply', 'Power backup'] }]);
      toast('Property added.');
    }
    nav('/owner/properties');
  };

  return (
    <>
      <div className="page-title"><div><h1>{id ? 'Edit Property' : 'Add Property'}</h1><p className="muted">Add up to four photos – the first one is the cover image.</p></div></div>
      <form className="card form-card wide" onSubmit={submit} noValidate>
        <div className="grid-2">
          <div className="field"><label>Property name</label><input value={f.name} onChange={set('name')} placeholder="e.g. Sunrise Villa" />{errs.name && <small className="err">{errs.name}</small>}</div>
          <div className="field"><label>Property type</label><select value={f.type} onChange={set('type')}>{['Villa', 'Apartment', 'House', 'Commercial'].map((t) => <option key={t}>{t}</option>)}</select></div>
          <div className="field"><label>Location</label><input value={f.location} onChange={set('location')} placeholder="City, area" />{errs.location && <small className="err">{errs.location}</small>}</div>
          <div className="field"><label>Monthly rent (₹)</label><input type="number" min="0" value={f.rent} onChange={set('rent')} />{errs.rent && <small className="err">{errs.rent}</small>}</div>
          <div className="field"><label>Bedrooms</label><input type="number" min="0" max="20" value={f.type === 'Commercial' ? 0 : f.beds} disabled={f.type === 'Commercial'} onChange={set('beds')} /></div>
          <div className="field"><label>Bathrooms</label><input type="number" min="0" max="20" value={f.baths} onChange={set('baths')} /></div>
          <div className="field"><label>Area (sq ft) <span className="opt">(optional)</span></label><input type="number" min="0" value={f.area} onChange={set('area')} /></div>
          <div className="field"><label>Availability status</label><select value={f.status} onChange={set('status')}><option>Available</option><option>Rented</option></select></div>
        </div>
        <div className="field"><label>Property description</label><textarea rows="4" value={f.description} onChange={set('description')} />{errs.description && <small className="err">{errs.description}</small>}</div>
        <div className="field">
          <label>Property images (URLs)</label>
          <div className="img-inputs">
            {f.images.map((s, i) => (
              <div key={i} className="img-in">
                <div className="img-prev">{s ? <Img src={s} alt="" /> : <span>{i === 0 ? 'Cover' : `Photo ${i + 1}`}</span>}</div>
                <input value={s} onChange={setImg(i)} placeholder={i === 0 ? 'Main image URL (required)' : 'Image URL (optional)'} />
              </div>
            ))}
          </div>
          {errs.image && <small className="err">{errs.image}</small>}
        </div>
        <div className="form-actions">
          <button className="btn btn-primary"><Save size={16} /> {id ? 'Save changes' : 'Add Property'}</button>
          <button type="button" className="btn btn-ghost" onClick={() => nav('/owner/properties')}><X size={16} /> Cancel</button>
        </div>
      </form>
    </>
  );
}
