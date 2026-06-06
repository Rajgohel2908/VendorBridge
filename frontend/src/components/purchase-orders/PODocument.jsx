import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 12 },
  title: { fontSize: 24, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
});

export default function PODocument() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Purchase Order</Text>
        <View style={styles.row}>
          <Text>PO-2026-0001</Text>
          <Text>VendorBridge</Text>
        </View>
      </Page>
    </Document>
  );
}
