import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';

export default function VendorForm() {
  return (
    <form className="grid gap-5">
      <section className="grid gap-3">
        <h3 className="text-xs font-semibold uppercase text-brand-muted">Basic Info</h3>
        <Input label="Vendor Name" placeholder="Acme Supplies" />
        <Input label="Category" placeholder="Raw materials" />
      </section>
      <section className="grid gap-3">
        <h3 className="text-xs font-semibold uppercase text-brand-muted">GST & Legal</h3>
        <Input label="GST Number" placeholder="22AAAAA0000A1Z5" />
      </section>
      <section className="grid gap-3">
        <h3 className="text-xs font-semibold uppercase text-brand-muted">Contact Details</h3>
        <Input label="Email" type="email" placeholder="vendor@example.com" />
        <Input label="Phone" placeholder="+1 555 0100" />
        <Input label="Address" placeholder="Street, city, country" />
      </section>
      <Button variant="blue" type="button">Save Vendor</Button>
    </form>
  );
}
