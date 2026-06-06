import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppStore } from './store/useAppStore.js';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
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

export default function App() {
  const initAuth = useAppStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vendors" element={<VendorList />} />
        <Route path="/vendors/new" element={<VendorNew />} />
        <Route path="/vendors/:id" element={<VendorDetail />} />
        <Route path="/rfq" element={<RFQList />} />
        <Route path="/rfq/new" element={<RFQNew />} />
        <Route path="/rfq/:id" element={<RFQDetail />} />
        <Route path="/rfq/:id/compare" element={<QuotationComparison />} />
        <Route path="/rfq/:id/quotations" element={<QuotationSubmit />} />
        <Route path="/quotations" element={<QuotationList />} />
        <Route path="/approvals" element={<ApprovalQueue />} />
        <Route path="/approvals/:id" element={<ApprovalDetail />} />
        <Route path="/purchase-orders" element={<POList />} />
        <Route path="/purchase-orders/:id" element={<PODetail />} />
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/invoices/:id" element={<InvoiceDetail />} />
        <Route path="/activity" element={<ActivityLogs />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}
