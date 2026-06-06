import { useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Input from '../../components/ui/Input.jsx';
import { useInvoiceDetail, useEmailInvoice } from '../../hooks/useInvoices.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

const statusTone = { GENERATED: 'blue', SENT: 'amber', PAID: 'green' };

export default function InvoiceDetail() {
  const { id } = useParams();
  const { data, isLoading } = useInvoiceDetail(id);
  const emailMutation = useEmailInvoice();
  const [showEmail, setShowEmail] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: '', subject: '', notes: '' });
  const inv = data?.data;

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!inv) return <p className="py-10 text-center text-brand-muted">Invoice not found.</p>;

  const handleEmail = () => {
    emailMutation.mutate({ id, data: emailForm }, { onSuccess: () => setShowEmail(false) });
  };

  return (
    <>
      <PageHeader
        title={inv.invoiceNo}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>Print</Button>
            <Button variant="blue" onClick={() => { setEmailForm({ email: inv.vendorId?.email || '', subject: `Invoice ${inv.invoiceNo}`, notes: '' }); setShowEmail(true); }}>Send via Email</Button>
          </div>
        }
      />
      <Card className="p-6 print:shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">INVOICE</h2>
            <p className="mt-1 text-sm text-brand-muted">{inv.invoiceNo}</p>
          </div>
          <div className="text-right">
            <img src="/logo.svg" alt="VendorBridge" className="ml-auto h-10 w-10" />
            <Badge tone={statusTone[inv.status]} className="mt-2">{inv.status}</Badge>
          </div>
        </div>
        <div className="mt-6 grid gap-6 text-sm md:grid-cols-2">
          <div>
            <p className="font-semibold">Vendor</p>
            <p>{inv.vendorId?.name}</p>
            <p className="text-brand-muted">{inv.vendorId?.email}</p>
            {inv.vendorId?.address && <p className="text-brand-muted">{inv.vendorId.address}</p>}
            {inv.vendorId?.gstNumber && <p className="text-brand-muted">GST: {inv.vendorId.gstNumber}</p>}
          </div>
          <div className="md:text-right">
            <p className="font-semibold">Invoice Date</p>
            <p>{formatDate(inv.createdAt)}</p>
            {inv.poId?.poNumber && <p className="mt-2 text-brand-muted">PO: {inv.poId.poNumber}</p>}
          </div>
        </div>
        <div className="mt-6 rounded border border-brand-border text-sm">
          <div className="grid grid-cols-[1fr_auto] gap-4 bg-slate-50 px-4 py-3 font-semibold">
            <span>Description</span><span>Amount</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-4 border-t border-brand-border px-4 py-3">
            <span>{inv.poId?.rfqId?.title || 'Service'}</span>
            <span>{formatCurrency(inv.subtotal)}</span>
          </div>
        </div>
        <div className="mt-4 text-right text-sm">
          <p>Subtotal: {formatCurrency(inv.subtotal)}</p>
          <p>GST 18%: {formatCurrency(inv.tax)}</p>
          <p className="mt-1 text-lg font-semibold">Grand Total: {formatCurrency(inv.total)}</p>
        </div>
      </Card>

      {showEmail && (
        <Modal title="Send Invoice" onClose={() => setShowEmail(false)}>
          <div className="grid gap-4">
            <Input label="Vendor Email" value={emailForm.email} onChange={(e) => setEmailForm((f) => ({ ...f, email: e.target.value }))} />
            <Input label="Subject" value={emailForm.subject} onChange={(e) => setEmailForm((f) => ({ ...f, subject: e.target.value }))} />
            <textarea className="min-h-24 rounded border border-brand-border px-3 py-2 text-sm" placeholder="Notes" value={emailForm.notes} onChange={(e) => setEmailForm((f) => ({ ...f, notes: e.target.value }))} />
            <Button variant="blue" onClick={handleEmail} disabled={emailMutation.isPending}>
              {emailMutation.isPending ? <><Spinner /> Sending…</> : 'Send'}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
