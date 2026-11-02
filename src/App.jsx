import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Explore from './pages/Explore';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import Properties from './pages/owner/Properties';
import AddProperty from './pages/owner/AddProperty';
import Tenants from './pages/owner/Tenants';
import Payments from './pages/owner/Payments';
import Leases from './pages/owner/Leases';
import OwnerMessages from './pages/owner/Messages';
import TenantDashboard from './pages/tenant/TenantDashboard';
import MyProperty from './pages/tenant/MyProperty';
import MyPayments from './pages/tenant/MyPayments';
import MyLease from './pages/tenant/MyLease';
import TenantMessages from './pages/tenant/Messages';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/owner" element={<ProtectedRoute role="owner"><DashboardLayout role="owner" /></ProtectedRoute>}>
          <Route index element={<OwnerDashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/new" element={<AddProperty />} />
          <Route path="properties/:id/edit" element={<AddProperty />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="payments" element={<Payments />} />
          <Route path="leases" element={<Leases />} />
          <Route path="messages" element={<OwnerMessages />} />
        </Route>

        <Route path="/tenant" element={<ProtectedRoute role="tenant"><DashboardLayout role="tenant" /></ProtectedRoute>}>
          <Route index element={<TenantDashboard />} />
          <Route path="property" element={<MyProperty />} />
          <Route path="payments" element={<MyPayments />} />
          <Route path="lease" element={<MyLease />} />
          <Route path="messages" element={<TenantMessages />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
