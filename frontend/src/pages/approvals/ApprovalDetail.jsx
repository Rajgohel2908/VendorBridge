import PageHeader from '../../components/layout/PageHeader.jsx';
import ApprovalTimeline from '../../components/approvals/ApprovalTimeline.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';

export default function ApprovalDetail() {
  return (
    <>
      <PageHeader title="Approval Detail" />
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="p-4">
          <h2 className="font-semibold">Selected quotation</h2>
          <p className="mt-2 text-sm text-brand-muted">Acme Supplies · $12,000 · 15 delivery days</p>
          <textarea className="mt-4 min-h-28 w-full rounded border border-brand-border px-3 py-2 text-sm" placeholder="Remarks" />
          <div className="mt-4 flex gap-3">
            <Button variant="success">Approve</Button>
            <Button variant="danger">Reject</Button>
          </div>
        </Card>
        <Card className="p-4">
          <ApprovalTimeline />
        </Card>
      </div>
    </>
  );
}
