import PageHeader from '../../components/layout/PageHeader.jsx';
import POCard from '../../components/purchase-orders/POCard.jsx';

export default function POList() {
  return (
    <>
      <PageHeader title="Purchase Orders" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <POCard />
      </div>
    </>
  );
}
