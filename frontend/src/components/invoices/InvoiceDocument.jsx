import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 12 },
  title: { fontSize: 24, marginBottom: 16 },
  total: { marginTop: 16, fontSize: 16 },
});

export default function InvoiceDocument() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>INVOICE</Text>
        <View>
          <Text>INV-2026-0001</Text>
          <Text>GST 18%</Text>
          <Text style={styles.total}>Grand Total: $14,160</Text>
        </View>
      </Page>
    </Document>
  );
}
