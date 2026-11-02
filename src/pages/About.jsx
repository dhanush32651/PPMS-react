import { Link } from 'react-router-dom';
import { Target, Eye, Layers } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import Parallax from '../components/Parallax';
import { useLS } from '../utils/localStorage';

export default function About() {
  const [props] = useLS('properties');
  return (
    <>
      <Navbar solid />
      <section className="page-hero"><div className="container"><h1>About Us</h1><p>Making property management organised, efficient and friendly.</p></div></section>
      <section className="section">
        <div className="container split">
          <Reveal>
            <h2>The problem we solve</h2>
            <p className="lead">Owners who manage several properties often track tenants, rent and leases by hand. Details get lost, payments are missed and communication is scattered.</p>
            <p className="lead">Property Manager brings everything into one place: owners manage properties, tenants, payments and leases, while tenants see their own property, payment history, lease and messages.</p>
            <Link to="/register" className="btn btn-primary">Get started</Link>
          </Reveal>
          <Parallax src={props[4]?.images?.[0] || ''} alt="Villa" speed={0.12} tilt={5} className="feature-frame" />
        </div>
      </section>
      <section className="section alt">
        <div className="container grid-3">
          {[[Target, 'Mission', 'Make property management simple enough for anyone to use confidently.'],
            [Eye, 'Vision', 'A single, clear workspace for every landlord and tenant relationship.'],
            [Layers, 'Technology', 'React, Vite, React Router, Local Storage, and handcrafted CSS.']].map(([I, t, d], i) => (
            <Reveal key={t} delay={i * 80} className="why-card"><span className="ico"><I size={24} /></span><h3>{t}</h3><p>{d}</p></Reveal>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
