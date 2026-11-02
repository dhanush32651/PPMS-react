import Chat from '../../components/Chat';
import NoProperty from '../../components/NoProperty';
import { useAuth } from '../../context/AuthContext';
import { getTenantData } from './helpers';

export default function TenantMessages() {
  const { user } = useAuth();
  const { property, owner } = getTenantData(user.email);
  if (!property) return <><div className="page-title"><h1>Messages</h1></div><NoProperty /></>;
  const contacts = [{ email: property.ownerEmail, name: owner?.name || 'Property Owner', sub: `Owner · ${property.name}` }];
  return (
    <>
      <div className="page-title"><div><h1>Messages</h1><p className="muted">Talk to your property owner.</p></div></div>
      <Chat me={user} contacts={contacts} />
    </>
  );
}
