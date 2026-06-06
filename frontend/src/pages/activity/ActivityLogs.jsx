import PageHeader from '../../components/layout/PageHeader.jsx';
import ActivityFeed from '../../components/activity/ActivityFeed.jsx';
import Card from '../../components/ui/Card.jsx';
import Table from '../../components/ui/Table.jsx';

const rows = [{ Timestamp: '2026-06-03 10:30', User: 'Priya', Action: 'Created RFQ', Entity: 'RFQ', 'Entity ID': 'RFQ-001' }];

export default function ActivityLogs() {
  return (
    <>
      <PageHeader title="Activity Logs" />
      <Card className="mb-5 p-4">
        <ActivityFeed />
      </Card>
      <Table columns={['Timestamp', 'User', 'Action', 'Entity', 'Entity ID']} rows={rows} />
    </>
  );
}
