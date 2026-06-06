import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppStore } from './store/useAppStore.js';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import RoleGuard from './components/auth/RoleGuard.jsx';
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import VendorList from './pages/vendors/VendorList.jsx';
import VendorNew from './pages/vendors/VendorNew.jsx';
import VendorDetail from './pages/vendors/VendorDetail.jsx';
import RFQList from './pages/rfq/RFQList.jsx';
import RFQNew from './pages/rfq/RFQNew.jsx';
import RFQDetail from './pages/rfq/RFQDetail.jsx';
import QuotationComparison from './pages/rfq/QuotationComparison.jsx';
import QuotationList from './pages/quotations/QuotationList.jsx';
import QuotationSubmit from './pages/quotations/QuotationSubmit.jsx';
import ApprovalQueue from './pages/approvals/ApprovalQueue.jsx';
import ApprovalDetail from './pages/approvals/ApprovalDetail.jsx';
import POList from './pages/purchase-orders/POList.jsx';
import PODetail from './pages/purchase-orders/PODetail.jsx';
import InvoiceList from './pages/invoices/InvoiceList.jsx';
import InvoiceDetail from './pages/invoices/InvoiceDetail.jsx';
import ActivityLogs from './pages/activity/ActivityLogs.jsx';
import Reports from './pages/reports/Reports.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';

export default function App() {
  const initAuth = useAppStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* All authenticated routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Dashboard — accessible by all authenticated users */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* RFQ list & detail — all authenticated users can view */}
          <Route path="/rfq" element={<RFQList />} />
          <Route path="/rfq/:id" element={<RFQDetail />} />

          {/* RFQ creation — Procurement Officer only */}
          <Route element={<RoleGuard roles={['PROCUREMENT_OFFICER']} />}>
            <Route path="/rfq/new" element={<RFQNew />} />
          </Route>

          {/* RFQ comparison — Procurement Officer + Manager */}
          <Route element={<RoleGuard roles={['PROCUREMENT_OFFICER', 'MANAGER']} />}>
            <Route path="/rfq/:id/compare" element={<QuotationComparison />} />
          </Route>

          {/* Vendor management — Admin only (Manage vendors) */}
          <Route element={<RoleGuard roles={['ADMIN']} />}>
            <Route path="/vendors" element={<VendorList />} />
            <Route path="/vendors/new" element={<VendorNew />} />
            <Route path="/vendors/:id" element={<VendorDetail />} />
          </Route>

          {/* PO — Admin, Procurement Officer, Manager, and Vendor */}
          <Route element={<RoleGuard roles={['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR']} />}>
            <Route path="/purchase-orders" element={<POList />} />
            <Route path="/purchase-orders/:id" element={<PODetail />} />
          </Route>

          {/* Invoices — Admin, Procurement Officer, Manager */}
          <Route element={<RoleGuard roles={['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER']} />}>
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoices/:id" element={<InvoiceDetail />} />
          </Route>

          {/* Quotations — All authenticated roles */}
          <Route element={<RoleGuard roles={['ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER', 'VENDOR']} />}>
            <Route path="/quotations" element={<QuotationList />} />
            <Route path="/rfq/:id/quotations" element={<QuotationSubmit />} />
          </Route>

          {/* Approval workflow — Manager only */}
          <Route element={<RoleGuard roles={['MANAGER']} />}>
            <Route path="/approvals" element={<ApprovalQueue />} />
            <Route path="/approvals/:id" element={<ApprovalDetail />} />
          </Route>

          {/* Reports — Admin only (View procurement analytics) */}
          <Route element={<RoleGuard roles={['ADMIN']} />}>
            <Route path="/reports" element={<Reports />} />
          </Route>

          {/* Admin panel — Admin only */}
          <Route element={<RoleGuard roles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminUsers />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
