import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#1e293b' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  companyName: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#1e40af' },
  companyTag: { fontSize: 9, color: '#64748b', marginTop: 2 },
  invoiceTitle: { fontSize: 28, fontFamily: 'Helvetica-Bold', textAlign: 'right', color: '#1e293b' },
  invoiceNo: { fontSize: 10, textAlign: 'right', color: '#64748b', marginTop: 2 },
  section: { marginTop: 18 },
  sectionLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  vendorName: { fontSize: 12, fontFamily: 'Helvetica-Bold' },
  smallText: { fontSize: 9, color: '#64748b' },
  divider: { borderBottomWidth: 1, borderBottomColor: '#e2e8f0', marginVertical: 12 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f1f5f9', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 4 },
  tableHeaderText: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: '#475569' },
  tableRow: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: 'center' },
  colPrice: { flex: 1, textAlign: 'right' },
  colTotal: { flex: 1, textAlign: 'right' },
  totalsSection: { marginTop: 12, alignItems: 'flex-end' },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 4, width: 200 },
  totalLabel: { flex: 1, textAlign: 'right', paddingRight: 12, color: '#64748b' },
  totalValue: { width: 80, textAlign: 'right' },
  grandTotal: { fontFamily: 'Helvetica-Bold', fontSize: 14, color: '#1e40af' },
  grandTotalLabel: { fontFamily: 'Helvetica-Bold', fontSize: 12 },
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#94a3b8', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 10 },
});

function fmt(val) {
  const n = typeof val === 'number' ? val : parseFloat(val) || 0;
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function InvoiceDocument({ invoice }) {
  if (!invoice) return null;

  const vendor = invoice.vendorId || {};
  const po = invoice.poId || {};
  const rfq = po.rfqId || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>VendorBridge</Text>
            <Text style={styles.companyTag}>Procurement Management Platform</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNo}>{invoice.invoiceNo}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Vendor & Invoice Info */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionLabel}>Bill To</Text>
            <Text style={styles.vendorName}>{vendor.name || '—'}</Text>
            <Text style={styles.smallText}>{vendor.email || ''}</Text>
            {vendor.address && <Text style={styles.smallText}>{vendor.address}</Text>}
            {vendor.gstNumber && <Text style={styles.smallText}>GST: {vendor.gstNumber}</Text>}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.sectionLabel}>Invoice Details</Text>
            <View style={styles.row}>
              <Text style={styles.smallText}>Date: </Text>
              <Text>{fmtDate(invoice.createdAt)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.smallText}>Status: </Text>
              <Text>{invoice.status}</Text>
            </View>
            {po.poNumber && (
              <View style={styles.row}>
                <Text style={styles.smallText}>PO: </Text>
                <Text>{po.poNumber}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Items</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colDesc]}>Description</Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.colPrice]}>Unit Price</Text>
            <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colDesc}>{rfq.title || 'Service'}</Text>
            <Text style={styles.colQty}>{rfq.quantity || '1'}</Text>
            <Text style={styles.colPrice}>{rfq.quantity ? fmt(invoice.subtotal / rfq.quantity) : '—'}</Text>
            <Text style={styles.colTotal}>{fmt(invoice.subtotal)}</Text>
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{fmt(invoice.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>GST (18%)</Text>
            <Text style={styles.totalValue}>{fmt(invoice.tax)}</Text>
          </View>
          <View style={[styles.divider, { width: 200 }]} />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, styles.grandTotalLabel]}>Grand Total</Text>
            <Text style={[styles.totalValue, styles.grandTotal]}>{fmt(invoice.total)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>VendorBridge — Procurement Management Platform · This is a system-generated invoice.</Text>
        </View>
      </Page>
    </Document>
  );
}
