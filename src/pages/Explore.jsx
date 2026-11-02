import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import PropertyModal from '../components/PropertyModal';
import { useLS, money } from '../utils/localStorage';

const TYPES = ['All', 'Villa', 'Apartment', 'House', 'Commercial'];

export default function Explore() {
  const [props] = useLS('properties');
  const [favs, setFavs] = useLS('favorites');
  const [selected, setSelected] = useState(null);
  const [q, setQ] = useState('');
  const [type, setType] = useState('All');
  const [status, setStatus] = useState('All');
  const [beds, setBeds] = useState('Any');
  const [maxRent, setMaxRent] = useState(50000);
  const [sort, setSort] = useState('featured');
  const [saved, setSaved] = useState(false);

  const toggleFav = (id) => setFavs(favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id]);

  const list = useMemo(() => {
    let r = props.filter((p) =>
      (type === 'All' || p.type === type) &&
      (status === 'All' || p.status === status) &&
      (beds === 'Any' || p.beds >= Number(beds)) &&
      p.rent <= maxRent &&
      (!saved || favs.includes(p.id)) &&
      `${p.name} ${p.location} ${p.type}`.toLowerCase().includes(q.toLowerCase())
    );
    if (sort === 'low') r = [...r].sort((a, b) => a.rent - b.rent);
    if (sort === 'high') r = [...r].sort((a, b) => b.rent - a.rent);
    if (sort === 'name') r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [props, q, type, status, beds, maxRent, sort, saved, favs]);

  const reset = () => { setQ(''); setType('All'); setStatus('All'); setBeds('Any'); setMaxRent(50000); setSort('featured'); setSaved(false); };

  return (
    <>
      <Navbar solid />
      <section className="page-hero"><div className="container"><h1>Explore Properties</h1><p>Search, filter and compare homes and workspaces across cities.</p></div></section>
      <section className="section tight">
        <div className="container">
          <div className="filter-bar">
            <div className="search-box"><Search size={18} /><input placeholder="Search by name, city or type…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
            <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Availability">
              <option value="All">Any availability</option><option>Available</option><option>Rented</option>
            </select>
            <select value={beds} onChange={(e) => setBeds(e.target.value)} aria-label="Bedrooms">
              <option value="Any">Any bedrooms</option><option value="1">1+ beds</option><option value="2">2+ beds</option><option value="3">3+ beds</option><option value="4">4+ beds</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
              <option value="featured">Sort: Featured</option><option value="low">Rent: low to high</option><option value="high">Rent: high to low</option><option value="name">Name A–Z</option>
            </select>
          </div>
          <div className="filter-row">
            <div className="tabs">{TYPES.map((t) => <button key={t} className={t === type ? 'on' : ''} onClick={() => setType(t)}>{t}</button>)}</div>
            <label className="range"><SlidersHorizontal size={16} /> Max rent: <strong>{money(maxRent)}</strong>
              <input type="range" min="10000" max="50000" step="1000" value={maxRent} onChange={(e) => setMaxRent(Number(e.target.value))} />
            </label>
            <button className={`chip ${saved ? 'on' : ''}`} onClick={() => setSaved(!saved)}><Heart size={15} /> Saved ({favs.length})</button>
            <button className="chip" onClick={reset}><X size={15} /> Reset</button>
          </div>
          <p className="muted mt-s">{list.length} propert{list.length === 1 ? 'y' : 'ies'} found</p>
          {list.length ? (
            <div className="grid-cards">
              {list.map((p) => <PropertyCard key={p.id} p={p} onView={setSelected} favorite={favs.includes(p.id)} onFavorite={toggleFav} />)}
            </div>
          ) : (
            <div className="empty"><Search size={40} /><h3>No properties match your filters</h3><p>Try widening the rent range or clearing a filter.</p><button className="btn btn-primary" onClick={reset}>Reset filters</button></div>
          )}
        </div>
      </section>
      <Footer />
      <PropertyModal property={selected} onClose={() => setSelected(null)} />
    </>
  );
}
