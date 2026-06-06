import Stepper from '../ui/Stepper.jsx';

export default function ApprovalTimeline() {
  return (
    <Stepper
      steps={[
        { label: 'Created', done: true },
        { label: 'Submitted', done: true },
        { label: 'Pending Approval', done: false },
        { label: 'Approved / Rejected', done: false },
      ]}
    />
  );
}
