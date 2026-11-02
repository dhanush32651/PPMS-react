import { useState } from 'react';
import { MapPin, BedDouble, Bath, Maximize, Check } from 'lucide-react';
import NoProperty from '../../components/NoProperty';
import StatusBadge from '../../components/StatusBadge';
import Img from '../../components/Img';
import { useAuth } from '../../context/AuthContext';
import { money } from '../../utils/localStorage';
import { getTenantData } from './helpers';

export default function MyProperty() {
  const { user } = useAuth();
  const { property: p, tenant } = getTenantData(user.email);
  const [idx, setIdx] = useState(0);
  if (!p) return <><div className="page-title"><h1>My Property</h1></div><NoProperty /></>;
  const imgs = (p.images || []).filter(Boolean);
  return (
    <>
      <div className="page-title"><div><h1>My Property</h1><p className="muted">The home assigned to you.</p></div></div>
      <div className="card my-prop">
        <div>
          <div className="gallery-main"><Img key={idx} src={imgs[idx]} alt={p.name} /></div>
          <div className="thumbs">{imgs.map((s, i) => <button key={i} className={i === idx ? 'on' : ''} onClick={() => setIdx(i)}><Img src={s} alt="" /></button>)}</div>
        </div>
        <div className="pm-info">
          <div className="row between"><h2>{p.name}</h2><StatusBadge status={tenant.status} /></div>
          <p className="muted loc"><MapPin size={16} /> {p.location}</p>
          <p className="price big">{money(p.rent)}<small>/month</small></p>
          <div className="spec-row">
            <span className="badge gray">{p.type}</span>
            {p.type !== 'Commercial' && <span><BedDouble size={16} /> {p.beds} Bedrooms</span>}
            <span><Bath size={16} /> {p.baths} Bathrooms</span>
            {p.area ? <span><Maximize size={16} /> {p.area} sq ft</span> : null}
          </div>
          <p className="desc">{p.description}</p>
          <p className="muted">Tenancy status: <strong>{tenant.status}</strong></p>
          <div className="amen">{(p.amenities || []).map((a) => <span key={a}><Check size={14} /> {a}</span>)}</div>
        </div>
      </div>
    </>
  );
}
