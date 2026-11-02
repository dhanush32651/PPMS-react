import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2, PlusSquare, Search } from 'lucide-react';
import PropertyCard from '../../components/PropertyCard';
import PropertyModal from '../../components/PropertyModal';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLS } from '../../utils/localStorage';

export default function Properties() {
  const { user } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const [all, setAll] = useLS('properties');
  const [view, setView] = useState(null);
  const [del, setDel] = useState(null);
  const [q, setQ] = useState('');
  const [type, setType] = useState('All');

  const mine = all.filter((p) => p.ownerEmail === user.email)
    .filter((p) => (type === 'All' || p.type === type) && `${p.name} ${p.location}`.toLowerCase().includes(q.toLowerCase()));

  const remove = () => {
    setAll(all.filter((p) => p.id !== del.id));
    toast(`"${del.name}" deleted.`);
    setDel(null);
  };

  return (
    <>
      <div className="page-title">
        <div><h1>My Properties</h1><p className="muted">{mine.length} propert{mine.length === 1 ? 'y' : 'ies'}</p></div>
        <Link to="/owner/properties/new" className="btn btn-primary"><PlusSquare size={16} /> Add property</Link>
      </div>
      <div className="toolbar">
        <div className="search-box"><Search size={18} /><input placeholder="Search properties…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {['All', 'Villa', 'Apartment', 'House', 'Commercial'].map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      {mine.length ? (
        <div className="grid-cards">
          {mine.map((p) => (
            <PropertyCard key={p.id} p={p} actions={
              <div className="act-row">
                <button className="icon-btn sq" title="View" onClick={() => setView(p)}><Eye size={17} /></button>
                <button className="icon-btn sq" title="Edit" onClick={() => nav(`/owner/properties/${p.id}/edit`)}><Pencil size={17} /></button>
                <button className="icon-btn sq danger" title="Delete" onClick={() => setDel(p)}><Trash2 size={17} /></button>
              </div>
            } />
          ))}
        </div>
      ) : (
        <div className="empty"><h3>No properties found</h3><p>Add your first property to get started.</p><Link to="/owner/properties/new" className="btn btn-primary">Add property</Link></div>
      )}
      <PropertyModal property={view} onClose={() => setView(null)} showEnquiry={false} />
      <Modal open={!!del} onClose={() => setDel(null)} title="Delete property?" footer={<><button className="btn btn-ghost" onClick={() => setDel(null)}>Cancel</button><button className="btn btn-danger" onClick={remove}>Delete</button></>}>
        <p>This will permanently remove <strong>{del?.name}</strong> from your listings.</p>
      </Modal>
    </>
  );
}
