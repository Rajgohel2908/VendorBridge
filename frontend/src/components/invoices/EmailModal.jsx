import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Modal from '../ui/Modal.jsx';

export default function EmailModal({ onClose }) {
  return (
    <Modal title="Send Invoice" onClose={onClose}>
      <div className="grid gap-4">
        <Input label="Vendor Email" defaultValue="billing@acme.test" />
        <Input label="Subject" defaultValue="Invoice INV-2026-0001" />
        <textarea className="min-h-24 rounded border border-brand-border px-3 py-2 text-sm" placeholder="Notes" />
        <Button variant="blue">Send</Button>
      </div>
    </Modal>
  );
}
