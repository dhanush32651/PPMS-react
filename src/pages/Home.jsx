import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Building2, Users, IndianRupee, FileText, MessageSquare, BarChart3, ChevronLeft, ChevronRight,
  ArrowRight, MapPin, Mail, Phone, Smartphone, Zap, Lock, Maximize2, KeyRound,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import Parallax from '../components/Parallax';
import PropertyCard from '../components/PropertyCard';
import PropertyModal from '../components/PropertyModal';
import Modal from '../components/Modal';
import Img from '../components/Img';
import { HERO_IMAGE } from '../data/seed';
import { useLS, money } from '../utils/localStorage';

const TYPES = ['All', 'Villa', 'Apartment', 'House', 'Commercial'];

export default function Home() {
  const [props] = useLS('properties');
  const [favs, setFavs] = useLS('favorites');
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('All');
  const [light, setLight] = useState(null);
  const rail = useRef(null);

  const featured = props.filter((p) => p.featured).slice(0, 4);
  const showFeatured = featured.length ? featured : props.slice(0, 4);
  const toggleFav = (id) => setFavs(favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id]);

  const gallery = props
    .filter((p) => tab === 'All' || p.type === tab)
    .flatMap((p) => (p.images || []).filter(Boolean).slice(0, 2).map((src) => ({ src, name: p.name, type: p.type, location: p.location })))
    .slice(0, 9);

  const scrollRail = (d) => rail.current?.scrollBy({ left: d * rail.current.clientWidth * 0.7, behavior: 'smooth' });

  return (
    <>
      <Navbar />
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"><span className="orb o1" /><span className="orb o2" /></div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="pill"><ShieldCheck size={15} /> Trusted by owners &amp; tenants</span>
            <h1>Manage Your Properties Smarter</h1>
            <p>One simple platform to manage properties, tenants, rental payments, and lease information.</p>
            <div className="hero-btns">
              <Link to="/explore" className="btn btn-accent btn-lg">Explore Properties</Link>
              <Link to="/register" className="btn btn-outline-light btn-lg">Get Started</Link>
            </div>
            <div className="hero-stats">
              <div><strong>{props.length}+</strong><span>Listings</span></div>
              <div><strong>4</strong><span>Photos each</span></div>
              <div><strong>2</strong><span>Dedicated portals</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <Parallax src={HERO_IMAGE} alt="Luxury villa" speed={0.1} tilt={5} className="hero-frame" />
            <div className="float-card fc1"><span className="dot-green" /> Rent received <strong>{money(25000)}</strong></div>
            <div className="float-card fc2"><Building2 size={18} /> Green Villa, Hyderabad</div>
            <div className="float-card fc3"><FileText size={18} /> Lease active · 2026</div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <h2>Featured Properties</h2>
            <p>Hand-picked villas, apartments, houses and offices. Open any listing to see all four photos.</p>
          </Reveal>
          <div className="grid-cards">
            {showFeatured.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <PropertyCard p={p} onView={setSelected} favorite={favs.includes(p.id)} onFavorite={toggleFav} />
              </Reveal>
            ))}
          </div>
          <div className="center mt"><Link to="/explore" className="btn btn-primary">View all properties <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      {/* HORIZONTAL SHOWCASE */}
      <section className="section dark-section">
        <div className="container">
          <Reveal className="section-head row between wrap">
            <div>
              <h2>Property Showcase</h2>
              <p>Scroll through our collection of spaces.</p>
            </div>
            <div className="rail-btns">
              <button className="icon-btn round" onClick={() => scrollRail(-1)} aria-label="Scroll left"><ChevronLeft /></button>
              <button className="icon-btn round" onClick={() => scrollRail(1)} aria-label="Scroll right"><ChevronRight /></button>
            </div>
          </Reveal>
        </div>
        <div className="rail" ref={rail}>
          {props.map((p) => (
            <button key={p.id} className="rail-item" onClick={() => setSelected(p)}>
              <Img src={p.images?.[0]} alt={p.name} />
              <div className="rail-cap">
                <span className="badge light">{p.type}</span>
                <h3>{p.name}</h3>
                <p><MapPin size={14} /> {p.location} · {money(p.rent)}/mo</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head"><h2>Why Choose Property Manager?</h2><p>Less paperwork, fewer follow-ups, one clear view of everything.</p></Reveal>
          <div className="grid-4">
            {[
              [Zap, 'Fast setup', 'Add a property in under a minute and start tracking rent right away.'],
              [Lock, 'Role-based access', 'Owners and tenants each get their own dashboard and see only what is theirs.'],
              [Smartphone, 'Works everywhere', 'A responsive layout that feels natural on phones, tablets and desktops.'],
              [BarChart3, 'Clear overview', 'Income, pending rent and lease status in one glance.'],
            ].map(([I, t, d], i) => (
              <Reveal key={t} delay={i * 70} className="why-card">
                <span className="ico"><I size={24} /></span><h3>{t}</h3><p>{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section alt">
        <div className="container split">
          <Reveal>
            <h2>Everything you need to run your rentals</h2>
            <p className="lead">Replace notebooks and spreadsheets with one organised workspace.</p>
            <ul className="feature-list">
              {[
                [Building2, 'Property management', 'List, edit and track every property with photos and details.'],
                [Users, 'Tenant records', 'Contact details, assigned property and status in one table.'],
                [IndianRupee, 'Rental payments', 'See paid, pending and overdue rent with clear badges.'],
                [FileText, 'Lease tracking', 'Start and end dates, deposit and status for every lease.'],
                [MessageSquare, 'Owner–tenant messages', 'Keep conversations next to the records they relate to.'],
              ].map(([I, t, d]) => (
                <li key={t}><span className="ico sm"><I size={18} /></span><div><strong>{t}</strong><p>{d}</p></div></li>
              ))}
            </ul>
          </Reveal>
          <Parallax src={props[1]?.images?.[1] || ''} alt="Modern interior" speed={0.14} tilt={6} className="feature-frame" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head"><h2>How It Works</h2><p>From sign-up to your first payment record in four steps.</p></Reveal>
          <div className="steps">
            {[
              ['Create an account', 'Sign up as an Owner or a Tenant.'],
              ['Add or find a property', 'Owners list properties; tenants see their assigned home.'],
              ['Assign tenants & leases', 'Link a tenant to a property and set up the lease.'],
              ['Track rent & chat', 'Follow payments and message each other in the app.'],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 90} className="step">
                <span className="num">{i + 1}</span><h3>{t}</h3><p>{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section alt">
        <div className="container">
          <Reveal className="section-head"><h2>Gallery</h2><p>Browse photos by property type.</p></Reveal>
          <div className="tabs">
            {TYPES.map((t) => <button key={t} className={t === tab ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}
          </div>
          <div className="mosaic">
            {gallery.map((g, i) => (
              <button key={g.src + i} className={`m-item m${i % 9}`} onClick={() => setLight(g)}>
                <Img src={g.src} alt={g.name} />
                <span className="m-cap"><Maximize2 size={14} /> {g.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
      <Modal open={!!light} onClose={() => setLight(null)} title={light ? `${light.name} · ${light.location}` : ''} wide>
        {light && <Img src={light.src} alt={light.name} className="lightbox-img" loading="eager" />}
      </Modal>

      {/* ABOUT PROJECT */}
      <section className="section">
        <div className="container about-box">
          <Reveal>
            <h2>About Our Project</h2>
            <p className="lead">Property Manager is a frontend web application built with React and Vite. It shows how a complete rental workflow can be designed – signup, login, role-based dashboards, property CRUD, payments, leases and messaging – using Local Storage for data.</p>
            <Link to="/about" className="btn btn-primary">Learn more <ArrowRight size={16} /></Link>
          </Reveal>
          <Reveal delay={100} className="tech-grid">
            {['React.js', 'Vite', 'React Router', 'Local Storage', 'CSS Grid & Flexbox', 'Lucide Icons'].map((t) => <span key={t}>{t}</span>)}
          </Reveal>
        </div>
      </section>

      {/* CTA + CONTACT */}
      <section className="cta">
        <div className="container cta-inner">
          <div>
            <KeyRound size={34} />
            <h2>Ready to simplify property management?</h2>
            <p>Try the demo: owner@example.com or rahul@example.com with password 123456.</p>
          </div>
          <div className="cta-btns">
            <Link to="/register" className="btn btn-accent btn-lg">Create free account</Link>
            <Link to="/login" className="btn btn-outline-light btn-lg">Login</Link>
          </div>
        </div>
      </section>
      <section className="section contact-strip">
        <div className="container grid-3">
          <div><Mail /><h4>Email</h4><p>hello@propertymanager.in</p></div>
          <div><Phone /><h4>Phone</h4><p>+91 98765 43210</p></div>
          <div><MapPin /><h4>Office</h4><p>Hyderabad, Telangana, India</p></div>
        </div>
      </section>
      <Footer />
      <PropertyModal property={selected} onClose={() => setSelected(null)} />
    </>
  );
}
