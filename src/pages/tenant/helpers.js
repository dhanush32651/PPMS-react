import { read } from '../../utils/localStorage';

// Everything that belongs to the logged-in tenant (and nobody else)
export function getTenantData(email) {
  const tenant = read('tenants', []).find((t) => t.email.toLowerCase() === email.toLowerCase() && t.status === 'Active');
  const property = tenant ? read('properties', []).find((p) => p.id === tenant.propertyId) : null;
  const owner = property ? read('users', []).find((u) => u.email === property.ownerEmail) : null;
  const lease = tenant ? read('leases', []).find((l) => l.tenantEmail.toLowerCase() === email.toLowerCase() && l.propertyId === tenant.propertyId) : null;
  const payments = read('payments', []).filter((p) => p.tenantEmail.toLowerCase() === email.toLowerCase());
  return { tenant, property, owner, lease, payments };
}
