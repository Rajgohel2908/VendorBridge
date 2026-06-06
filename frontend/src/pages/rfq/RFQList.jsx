import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import RFQCard from '../../components/rfq/RFQCard.jsx';

export default function RFQList() {
  return (
    <>
      <PageHeader title="RFQs" action={<Link to="/rfq/new"><Button variant="blue">Create RFQ</Button></Link>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <RFQCard title="Laptop procurement" deadline="2026-06-20" vendors={4} />
        <RFQCard title="Office furniture" deadline="2026-06-24" vendors={3} />
      </div>
    </>
  );
}
