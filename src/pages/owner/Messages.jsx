import Chat from '../../components/Chat';
import { useAuth } from '../../context/AuthContext';
import { read } from '../../utils/localStorage';

export default function OwnerMessages() {
  const { user } = useAuth();
  const props = read('properties', []);
  const ids = props.filter((p) => p.ownerEmail === user.email).map((p) => p.id);
  const seen = new Set();
  const contacts = read('tenants', [])
    .filter((t) => ids.includes(t.propertyId) && !seen.has(t.email) && seen.add(t.email))
    .map((t) => ({ email: t.email, name: t.name, sub: props.find((p) => p.id === t.propertyId)?.name }));
  return (
    <>
      <div className="page-title"><div><h1>Messages</h1><p className="muted">Chat with your tenants.</p></div></div>
      <Chat me={user} contacts={contacts} />
    </>
  );
}
