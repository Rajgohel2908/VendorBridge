import PageHeader from '../../components/layout/PageHeader.jsx';
import ApprovalCard from '../../components/approvals/ApprovalCard.jsx';

export default function ApprovalQueue() {
  return (
    <>
      <PageHeader title="Approval Queue" />
      <div className="grid gap-3">
        <ApprovalCard />
      </div>
    </>
  );
}
