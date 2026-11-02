# Property Manager – React + Vite

A client-ready, frontend-only Property Management System. Owners manage properties, tenants, rent and leases; tenants see their own property, payments, lease and messages. All data is stored in the browser's **Local Storage** (no backend).

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview
```

## Demo accounts (auto-created on first load)
| Role   | Email              | Password |
|--------|--------------------|----------|
| Owner  | owner@example.com  | 123456   |
| Tenant | rahul@example.com  | 123456   |

You can also sign up new accounts. An owner can assign a registered tenant to a property from **Manage Tenants → Add tenant**; that tenant will then see the property, lease and payments in their portal.

## Features
- Landing page: parallax hero, 3D-tilt property cards, horizontal showcase, gallery with lightbox, scroll reveals (all respect `prefers-reduced-motion`)
- Explore: search, type/availability/bedroom/rent filters, sort, saved ♥ properties, 4-photo gallery modal, enquiry form
- Dedicated Login & Sign Up pages (validation, duplicate-email check, role check, show/hide password)
- Owner portal: dashboard, property CRUD (4 images each), tenants (search/filter/add/remove), payments (mark paid / remind), leases (renew), messages
- Tenant portal: dashboard, my property, payments (pay now demo), lease (print), messages
- Protected, role-based routes

## Local Storage keys
`users`, `loggedInUser`, `properties`, `tenants`, `payments`, `leases`, `messages`, `favorites`, `enquiries`, `contacts`
To reset the demo data: DevTools → Application → Local Storage → Clear.

## Images
Photos are loaded from Unsplash and fall back to a built-in placeholder if offline. To use your own, put files in `public/images/` and reference them as `/images/yourfile.jpg` in `src/data/seed.js`.

## Deploy to Vercel
1. Push to GitHub: `git init && git add . && git commit -m "Initial commit"` then add your remote and push.
2. On vercel.com → **Add New Project** → import the repo. Framework: Vite (auto-detected), build `npm run build`, output `dist`.
3. `vercel.json` already rewrites all routes to `index.html`, so refreshing nested routes (e.g. `/owner/tenants`) works.

> Academic demo: passwords are stored in plain text in Local Storage. Do not use for production authentication.
