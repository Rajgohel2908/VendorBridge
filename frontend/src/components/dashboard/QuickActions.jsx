import { Plus, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';

export default function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link to="/rfq/new">
        <Button variant="outline">
          <Plus size={16} />
          Create RFQ
        </Button>
      </Link>
      <Link to="/vendors/new">
        <Button variant="outline">
          <UserPlus size={16} />
          Add Vendor
        </Button>
      </Link>
    </div>
  );
}
