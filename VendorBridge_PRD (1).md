# VendorBridge — Product Requirements Document
## AI Module: Gap Fixes & Missing Features
**Version:** 1.0 | **Date:** June 2026 | **Status:** Ready for Development

---

## 1. Overview

This PRD defines the exact requirements to fix all gaps identified in the VendorBridge gap analysis. The scope covers 7 missing features and 4 partial implementations across the frontend. All fixes must be complete before the hackathon submission.

---

## 2. Priority Matrix

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| P0 — Critical | PDF Invoice Download | Medium | High |
| P0 — Critical | Route Guards | Low | High |
| P1 — High | Quotation Edit | Low | Medium |
| P1 — High | Admin User Management | Medium | High |
| P1 — High | Vendor Rating System | Medium | Medium |
| P2 — Medium | Export Reports (CSV) | Low | Medium |
| P2 — Medium | Comparison Table Sorting | Low | Medium |

---

## 3. Feature Specifications

---

### F-01: PDF Invoice Download (P0)

**Problem:** `InvoiceDocument.jsx` exists but contains hardcoded dummy data and is not connected to any real invoice. No download button appears in `InvoiceDetail.jsx`.

**Acceptance Criteria:**
- [ ] `InvoiceDocument` component accepts real invoice data as props
- [ ] All invoice fields render correctly: invoiceNo, vendor name/email/GST, items, subtotal, GST 18%, grand total, PO number, date
- [ ] A "Download PDF" button appears in `InvoiceDetail` header alongside Print and Email buttons
- [ ] Clicking download triggers browser PDF download with filename `INV-{invoiceNo}.pdf`
- [ ] PDF is generated client-side using `@react-pdf/renderer` (already installed)

**Technical Notes:**
```jsx
// InvoiceDetail.jsx — add PDFDownloadLink
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoiceDocument from '../../components/invoices/InvoiceDocument.jsx';

<PDFDownloadLink document={<InvoiceDocument invoice={inv} />} fileName={`${inv.invoiceNo}.pdf`}>
  {({ loading }) => (
    <Button variant="outline">{loading ? 'Preparing…' : 'Download PDF'}</Button>
  )}
</PDFDownloadLink>
```

**InvoiceDocument props schema:**
```js
{
  invoiceNo: string,
  createdAt: string,
  status: string,
  subtotal: number,
  tax: number,
  total: number,
  vendorId: { name, email, address, gstNumber },
  poId: { poNumber, rfqId: { title } }
}
```

---

### F-02: Route Guards (P0)

**Problem:** Sidebar hides navigation links by role, but any user can manually type a restricted URL (e.g., `/vendors/new`) and access it.

**Acceptance Criteria:**
- [ ] A `ProtectedRoute` wrapper component is created in `src/utils/ProtectedRoute.jsx`
- [ ] Each route in `App.jsx` declares required roles
- [ ] Users accessing an unauthorized route are redirected to `/dashboard` with a toast/alert message
- [ ] Unauthenticated users are always redirected to `/login`

**Route → Role mapping:**

| Route | Allowed Roles |
|-------|--------------|
| /vendors, /vendors/new, /vendors/:id | ADMIN, PROCUREMENT_OFFICER |
| /rfq/new | PROCUREMENT_OFFICER |
| /rfq/:id/compare | PROCUREMENT_OFFICER, MANAGER |
| /quotations, /rfq/:id/quotations | VENDOR |
| /approvals, /approvals/:id | MANAGER |
| /purchase-orders, /purchase-orders/:id | ADMIN, PROCUREMENT_OFFICER |
| /invoices, /invoices/:id | ADMIN, PROCUREMENT_OFFICER |
| /reports | ADMIN, MANAGER |
| /admin | ADMIN |

**Implementation:**
```jsx
// src/utils/ProtectedRoute.jsx
export default function ProtectedRoute({ allowedRoles, children }) {
  const user = useAppStore((s) => s.user);
  const token = useAppStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
}
```

---

### F-03: Quotation Edit (P1)

**Problem:** Vendors can submit a quotation but cannot revise it after submission. `QuotationList.jsx` shows no edit action.

**Acceptance Criteria:**
- [ ] Vendor's `QuotationList` shows an "Edit" button for quotations in non-finalized RFQs (RFQ status = OPEN)
- [ ] Edit opens the same `QuotationSubmit` form pre-filled with existing values
- [ ] On submit, a PUT/PATCH request updates the quotation (not creates a new one)
- [ ] Edit is disabled if the RFQ is CLOSED or CANCELLED

**API Contract:**
```
PATCH /api/quotations/:id
Body: { price, deliveryDays, notes }
Response: { data: updatedQuotation }
```

---

### F-04: Admin User Management (P1)

**Problem:** ADMIN role exists but there is no `/admin` page. Admins cannot view, activate, or deactivate users.

**Acceptance Criteria:**
- [ ] New page at `src/pages/admin/AdminUsers.jsx`
- [ ] Route `/admin` added to `App.jsx` with `allowedRoles: ['ADMIN']`
- [ ] "Admin" link appears in Sidebar for ADMIN role
- [ ] Page lists all registered users: name, email, role, status (active/inactive)
- [ ] Admin can change a user's role from a dropdown
- [ ] Admin can deactivate/activate a user account

**Table columns:** Name | Email | Role | Status | Actions (Edit Role, Toggle Status)

**API Contracts:**
```
GET    /api/admin/users         → list all users
PATCH  /api/admin/users/:id     → { role?, isActive? }
```

---

### F-05: Vendor Rating System (P1)

**Problem:** Quotation comparison table requires vendor rating indicators (problem statement requirement) but no rating data exists on vendors.

**Acceptance Criteria:**
- [ ] `VendorForm.jsx` includes a "Rating" field (1–5 stars, stored as number)
- [ ] `VendorList.jsx` shows star rating column
- [ ] `VendorDetail.jsx` displays and allows editing the rating
- [ ] `QuotationComparison` table includes a "Rating" row showing star icons for each vendor
- [ ] Rating is auto-computed from past order history OR manually set by admin

**Star display component:**
```jsx
function StarRating({ value }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= value ? '#f59e0b' : '#d1d5db' }}>★</span>
      ))}
    </span>
  );
}
```

---

### F-06: Export Reports as CSV (P2)

**Problem:** Reports page has no export functionality. Hackathon requirement explicitly states "Exportable reports".

**Acceptance Criteria:**
- [ ] "Export CSV" button appears in Reports page header
- [ ] Export includes: vendor performance table (vendor name, orders count, total spend)
- [ ] CSV downloads with filename `vendorbridge-report-{YYYY-MM}.csv`
- [ ] No external library required — use native Blob + anchor trick

**Implementation:**
```js
function exportCSV(data) {
  const rows = [['Vendor', 'Orders', 'Spend'], ...data.map(v => [v.name, v.totalOrders, v.totalSpend])];
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `vendorbridge-report.csv`; a.click();
}
```

---

### F-07: Comparison Table Sorting & Filtering (P2)

**Problem:** `QuotationComparison` renders a static table. Users cannot sort by price or delivery time.

**Acceptance Criteria:**
- [ ] Column headers "Unit Price" and "Delivery (days)" are clickable sort triggers
- [ ] Clicking a header sorts columns (vendors) ascending; clicking again sorts descending
- [ ] Sort direction indicated by ↑ ↓ arrow icon next to header
- [ ] Default sort: lowest price first

---

## 4. Partial Fixes

### PF-01: Audit Logs Enhancement
**Current:** Activity logs show action + user + timestamp  
**Required:** Add `entityId` column linking to the affected record, and display before/after state for key changes (approval status change, quotation price edit)

### PF-02: Route Guard for Dashboard Pending Approvals
**Current:** Dashboard stats card shows "Pending Approvals" count as a number  
**Required:** Make the card clickable — clicking navigates to `/approvals` filtered to PENDING status

### PF-03: InvoiceDetail Print Styles
**Current:** `window.print()` prints the full page layout including sidebar  
**Required:** Add `@media print` CSS to hide sidebar, header, and action buttons. Only the invoice card should print.

### PF-04: Signup Role Restriction
**Current:** Signup form lets anyone self-select ADMIN role  
**Required:** Remove ADMIN from signup dropdown. Admin accounts should only be created by an existing admin via the Admin panel.

---

## 5. Definition of Done

A feature is complete when:
1. The UI change is implemented and renders without errors
2. API integration is wired (real data, not mock)
3. Role-based access is enforced both in UI and via route guard
4. The feature works end-to-end in the demo flow: Login → action → result visible

---

## 6. Demo Flow (for judges)

1. **Login as PROCUREMENT_OFFICER** → create RFQ → assign vendors
2. **Login as VENDOR** → submit quotation → edit quotation (F-03)
3. **Login as PROCUREMENT_OFFICER** → compare quotations (sorted by price, F-07) → select vendor → submit for approval
4. **Login as MANAGER** → approve quotation → PO auto-generates
5. **Login as PROCUREMENT_OFFICER** → view PO → generate invoice → download PDF (F-01) → print (PF-03) → email
6. **Login as ADMIN** → view admin panel (F-04) → change user role → view reports → export CSV (F-06)

---

*Document prepared for VendorBridge Hackathon Submission — June 2026*
