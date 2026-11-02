import { useRef } from 'react';
import { MapPin, BedDouble, Bath, Maximize, Heart, Building2 } from 'lucide-react';
import Img from './Img';
import StatusBadge from './StatusBadge';
import { money } from '../utils/localStorage';

export default function PropertyCard({ p, onView, favorite, onFavorite, actions }) {
  const ref = useRef(null);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const move = (e) => {
    if (reduce || !window.matchMedia('(hover: hover)').matches) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-6px)`;
  };
  const leave = () => ref.current && (ref.current.style.transform = '');

  return (
    <article ref={ref} className="prop-card" onMouseMove={move} onMouseLeave={leave}>
      <div className="prop-img">
        <Img src={p.images?.[0]} alt={p.name} />
        <span className="prop-type">{p.type}</span>
        <span className="prop-status"><StatusBadge status={p.status} /></span>
        {onFavorite && (
          <button className={`fav ${favorite ? 'on' : ''}`} onClick={() => onFavorite(p.id)} aria-label="Save property">
            <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
          </button>
        )}
        <span className="photo-count">{(p.images || []).filter(Boolean).length} photos</span>
      </div>
      <div className="prop-body">
        <h3>{p.name}</h3>
        <p className="muted loc"><MapPin size={15} /> {p.location}</p>
        <div className="prop-meta">
          {p.type === 'Commercial' ? (
            <span><Building2 size={15} /> Commercial</span>
          ) : (
            <>
              <span><BedDouble size={15} /> {p.beds} Beds</span>
              <span><Bath size={15} /> {p.baths} Baths</span>
            </>
          )}
          {p.area ? <span><Maximize size={15} /> {p.area} sq ft</span> : null}
        </div>
        <div className="prop-foot">
          <p className="price">{money(p.rent)}<small>/month</small></p>
          {actions || (
            <button className="btn btn-primary btn-sm" onClick={() => onView(p)}>View Details</button>
          )}
        </div>
      </div>
    </article>
  );
}
