import { Plus, UserPlus, ClipboardCheck, FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import { useAppStore } from '../../store/useAppStore.js';

export default function QuickActions() {
  const user = useAppStore((s) => s.user);
  const role = user?.role;

  const isProcurementOrAdmin = role === 'PROCUREMENT_OFFICER' || role === 'ADMIN';
  const isManager = role === 'MANAGER';
  const isVendor = role === 'VENDOR';

  return (
    <div className="flex flex-wrap gap-3">
      {isProcurementOrAdmin && (
        <>
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
        </>
      )}

      {isManager && (
        <Link to="/approvals">
          <Button variant="outline">
            <ClipboardCheck size={16} />
            Review Approvals
          </Button>
        </Link>
      )}

      {isVendor && (
        <Link to="/rfq">
          <Button variant="outline">
            <FileQuestion size={16} />
            View Open RFQs
          </Button>
        </Link>
      )}
    </div>
  );
}
