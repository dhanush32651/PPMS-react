import { read, write, has } from '../utils/localStorage';

const u = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
export const HERO_IMAGE = u('1613490493576-7fde63acd811', 1800);
export const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 520'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#172554'/><stop offset='1' stop-color='#2563EB'/></linearGradient></defs><rect width='800' height='520' fill='url(#g)'/><path d='M300 300 400 210l100 90v90h-70v-60h-60v60h-70z' fill='#10B981' opacity='.9'/></svg>`
  );

const OWNER = 'owner@example.com';
const RAHUL = 'rahul@example.com';
const AMEN = ['Parking', 'Power backup', '24/7 security', 'Water supply', 'Wi-Fi ready', 'Garden'];

const properties = [
  { id: 'p1', ownerEmail: OWNER, name: 'Green Villa', type: 'Villa', location: 'Hyderabad', rent: 25000, beds: 4, baths: 4, area: 3200, status: 'Rented', featured: true,
    description: 'A serene 4-bedroom villa surrounded by lush greenery, with a private garden, open-plan living area and a modular kitchen. Ideal for families who want space and privacy.',
    images: [u('1613490493576-7fde63acd811'), u('1600607687939-ce8a6c25118c'), u('1600566753190-17f0baa2a6c3'), u('1540518614846-7eded433c457')], amenities: [...AMEN, 'Swimming pool'] },
  { id: 'p2', ownerEmail: OWNER, name: 'Modern Apartment', type: 'Apartment', location: 'Vijayawada', rent: 18000, beds: 3, baths: 2, area: 1650, status: 'Available', featured: true,
    description: 'A bright 3-bedroom apartment in a gated community with a clubhouse, gym and covered parking. Walking distance to schools, hospitals and shopping.',
    images: [u('1545324418-cc1a3fa10c00'), u('1502672260266-1c1ef2d93688'), u('1556912172-45b7abe8b7e1'), u('1493809842364-78817add7ffb')], amenities: ['Lift', 'Gym', 'Clubhouse', 'Covered parking', '24/7 security', 'Power backup'] },
  { id: 'p3', ownerEmail: OWNER, name: 'Luxury House', type: 'House', location: 'Guntur', rent: 15000, beds: 3, baths: 2, area: 1800, status: 'Available', featured: true,
    description: 'A well-kept independent house with a spacious front yard, airy rooms and a separate dining space. Quiet neighbourhood close to the main market.',
    images: [u('1568605114967-8130f3a36994'), u('1600596542815-ffad4c1539a9'), u('1484154218962-a197022b5858'), u('1505691938895-1758d7feb511')], amenities: ['Parking', 'Garden', 'Borewell water', 'Power backup', 'Terrace'] },
  { id: 'p4', ownerEmail: OWNER, name: 'Premium Office Space', type: 'Commercial', location: 'Bengaluru', rent: 40000, beds: 0, baths: 2, area: 2400, status: 'Available', featured: true,
    description: 'A premium open-plan office floor with meeting rooms, reception area, high-speed fibre and dedicated parking, in a prime tech corridor.',
    images: [u('1497366216548-37526070297c'), u('1497366811353-6870744d04b2'), u('1486406146926-c627a92ad1ab'), u('1522771739844-6a9f6d5f14af')], amenities: ['Meeting rooms', 'Fibre internet', 'Cafeteria', 'Parking', 'Power backup', 'CCTV'] },
  { id: 'p5', ownerEmail: OWNER, name: 'Lakeview Villa', type: 'Villa', location: 'Visakhapatnam', rent: 32000, beds: 5, baths: 5, area: 4000, status: 'Available', featured: false,
    description: 'A grand 5-bedroom villa with a private pool and panoramic lake views. Double-height living room, home theatre and landscaped lawns.',
    images: [u('1512917774080-9991f1c4c750'), u('1613977257363-707ba9348227'), u('1600573472592-401b489a3cdc'), u('1512918728675-ed5a9ecdebfd')], amenities: [...AMEN, 'Swimming pool', 'Home theatre'] },
  { id: 'p6', ownerEmail: OWNER, name: 'Skyline Penthouse', type: 'Apartment', location: 'Hyderabad', rent: 45000, beds: 3, baths: 3, area: 2200, status: 'Rented', featured: false,
    description: 'A top-floor penthouse with floor-to-ceiling windows, a private terrace and skyline views. Fully fitted kitchen and designer interiors.',
    images: [u('1522708323590-d24dbb6b0267'), u('1560185007-cde436f6a4d0'), u('1560185127-6ed189bf02f4'), u('1502005229762-cf1b2da7c5d6')], amenities: ['Private terrace', 'Lift', 'Gym', 'Concierge', 'Power backup'] },
  { id: 'p7', ownerEmail: OWNER, name: 'Heritage Family House', type: 'House', location: 'Tirupati', rent: 22000, beds: 4, baths: 3, area: 2400, status: 'Available', featured: false,
    description: 'A warm 4-bedroom family home with a pooja room, large kitchen and sit-out. Close to schools and the temple town centre.',
    images: [u('1570129477492-45c003edd2be'), u('1600047509807-ba8f99d2cdde'), u('1600607688969-a5bfcd646154'), u('1600607687644-c7171b42498f')], amenities: ['Parking', 'Garden', 'Pooja room', 'Water supply', 'Security'] },
  { id: 'p8', ownerEmail: OWNER, name: 'Tech Park Studio', type: 'Commercial', location: 'Chennai', rent: 28000, beds: 0, baths: 2, area: 1500, status: 'Rented', featured: false,
    description: 'A modern studio office ideal for start-ups, with flexible seating, a pantry and a collaboration lounge.',
    images: [u('1497215728101-856f4ea42174'), u('1497366754035-f200968a6e72'), u('1519389950473-47ba0277781c'), u('1504384308090-c894fdcc538d')], amenities: ['Fibre internet', 'Pantry', 'Parking', 'CCTV', 'Power backup'] },
];

const users = [
  { id: 'u1', name: 'Admin Owner', email: OWNER, phone: '9876500001', password: '123456', role: 'owner' },
  { id: 'u2', name: 'Rahul Kumar', email: RAHUL, phone: '9876500002', password: '123456', role: 'tenant' },
];

const tenants = [
  { id: 't1', ownerEmail: OWNER, name: 'Rahul Kumar', email: RAHUL, phone: '9876500002', propertyId: 'p1', status: 'Active' },
  { id: 't2', ownerEmail: OWNER, name: 'Priya Sharma', email: 'priya@example.com', phone: '9876500003', propertyId: 'p6', status: 'Active' },
  { id: 't3', ownerEmail: OWNER, name: 'Kiran Rao', email: 'kiran@example.com', phone: '9876500004', propertyId: 'p8', status: 'Active' },
];

const pay = (id, t, name, pid, month, amount, due, date, status) => ({ id, tenantEmail: t, tenantName: name, propertyId: pid, month, amount, due, date, status });
const payments = [
  pay('y1', RAHUL, 'Rahul Kumar', 'p1', 'June 2026', 25000, '2026-06-05', '2026-06-03', 'Paid'),
  pay('y2', RAHUL, 'Rahul Kumar', 'p1', 'July 2026', 25000, '2026-07-05', '2026-07-04', 'Paid'),
  pay('y3', RAHUL, 'Rahul Kumar', 'p1', 'August 2026', 25000, '2026-08-05', '2026-08-05', 'Paid'),
  pay('y4', RAHUL, 'Rahul Kumar', 'p1', 'September 2026', 25000, '2026-09-05', '2026-09-02', 'Paid'),
  pay('y5', RAHUL, 'Rahul Kumar', 'p1', 'October 2026', 25000, '2026-10-05', null, 'Overdue'),
  pay('y6', RAHUL, 'Rahul Kumar', 'p1', 'November 2026', 25000, '2026-11-05', null, 'Pending'),
  pay('y7', 'priya@example.com', 'Priya Sharma', 'p6', 'October 2026', 45000, '2026-10-05', '2026-10-04', 'Paid'),
  pay('y8', 'priya@example.com', 'Priya Sharma', 'p6', 'November 2026', 45000, '2026-11-05', null, 'Pending'),
  pay('y9', 'kiran@example.com', 'Kiran Rao', 'p8', 'October 2026', 28000, '2026-10-05', '2026-10-01', 'Paid'),
  pay('y10', 'kiran@example.com', 'Kiran Rao', 'p8', 'November 2026', 28000, '2026-11-05', '2026-11-01', 'Paid'),
];

const leases = [
  { id: 'l1', tenantEmail: RAHUL, tenantName: 'Rahul Kumar', propertyId: 'p1', start: '2026-01-01', end: '2026-12-31', rent: 25000, deposit: 75000, status: 'Active' },
  { id: 'l2', tenantEmail: 'priya@example.com', tenantName: 'Priya Sharma', propertyId: 'p6', start: '2026-03-01', end: '2027-02-28', rent: 45000, deposit: 135000, status: 'Active' },
  { id: 'l3', tenantEmail: 'kiran@example.com', tenantName: 'Kiran Rao', propertyId: 'p8', start: '2025-04-01', end: '2026-03-31', rent: 28000, deposit: 84000, status: 'Active' },
];

const d = (days) => new Date(Date.now() - days * 864e5).toISOString();
const messages = [
  { id: 'm1', from: RAHUL, fromName: 'Rahul Kumar', to: OWNER, text: 'Hello, the water heater in the master bathroom is not working. Could you arrange a repair?', time: d(3) },
  { id: 'm2', from: OWNER, fromName: 'Admin Owner', to: RAHUL, text: 'Hi Rahul, thanks for letting me know. A technician will visit tomorrow between 10 AM and 12 PM.', time: d(3) },
  { id: 'm3', from: RAHUL, fromName: 'Rahul Kumar', to: OWNER, text: 'Perfect, thank you!', time: d(2) },
  { id: 'm4', from: 'priya@example.com', fromName: 'Priya Sharma', to: OWNER, text: 'Please share the updated maintenance schedule for the building.', time: d(1) },
];

// Only writes a key when it does not exist yet, so existing data is never overwritten.
export function initData() {
  const seed = { users, properties, tenants, payments, leases, messages, favorites: [], enquiries: [], contacts: [] };
  Object.entries(seed).forEach(([k, v]) => {
    if (!has(k)) write(k, v);
  });
  const existing = read('users', []);
  const missing = users.filter((s) => !existing.some((e) => e.email === s.email));
  if (missing.length) write('users', [...existing, ...missing]);
}
