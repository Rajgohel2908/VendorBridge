

const BASE_URL = 'http://127.0.0.1:5000/api';

async function login(email, password = 'password123') {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Login failed for ${email}: ${JSON.stringify(data)}`);
  return data.token;
}

async function testFlow() {
  try {
    console.log('--- Starting Flow Test ---');
    
    // 1. Login as Procurement Officer
    const poToken = await login('priya@vendorbridge.test');
    console.log('PO Login: Success');

    const rfqFormData = new FormData();
    rfqFormData.append('title', 'Test RFQ Flow');
    rfqFormData.append('description', 'Test description');
    rfqFormData.append('quantity', 10);
    rfqFormData.append('deadline', new Date(Date.now() + 86400000).toISOString());
    rfqFormData.append('vendors', JSON.stringify(['6a23c662b671344e9fafcdbb']));

    // 2. Create RFQ
    const rfqRes = await fetch(`${BASE_URL}/rfq`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${poToken}` },
      body: rfqFormData
    });
    const rfqData = await rfqRes.json();
    if (!rfqRes.ok) throw new Error(`Create RFQ failed: ${JSON.stringify(rfqData)}`);
    const rfqId = rfqData.data._id;
    console.log('Create RFQ: Success', rfqId);

    // 3. Login as Vendor
    const vendorToken = await login('vendor@acme.test');
    console.log('Vendor Login: Success');

    // 4. Submit Quotation
    const quoteRes = await fetch(`${BASE_URL}/quotations`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${vendorToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rfqId: rfqId,
        price: 500,
        deliveryDays: 5,
        notes: 'Test notes'
      })
    });
    const quoteData = await quoteRes.json();
    if (!quoteRes.ok) throw new Error(`Submit Quotation failed: ${JSON.stringify(quoteData)}`);
    const quoteId = quoteData.data._id;
    console.log('Submit Quotation: Success', quoteId);

    // 5. Login as Manager to Approve
    const managerToken = await login('karan@vendorbridge.test');
    console.log('Manager Login: Success');

    // Manager needs to approve quotation? Wait, PO creates approval request, then manager approves.
    // Let's check who creates Approval. 
    // In approval routes: router.post('/', allowRoles('PROCUREMENT_OFFICER'))
    // So PO creates approval request.

    // 6. PO Creates Approval Request
    const appReqRes = await fetch(`${BASE_URL}/approvals`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${poToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ quotationId: quoteId, rfqId: rfqId })
    });
    const appReqData = await appReqRes.json();
    if (!appReqRes.ok) throw new Error(`Create Approval Request failed: ${JSON.stringify(appReqData)}`);
    const approvalId = appReqData.data._id;
    console.log('Create Approval Request: Success', approvalId);

    // 7. Manager Approves
    const approveRes = await fetch(`${BASE_URL}/approvals/${approvalId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${managerToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'APPROVED', remarks: 'Looks good' })
    });
    const approveData = await approveRes.json();
    if (!approveRes.ok) throw new Error(`Approve Quotation failed: ${JSON.stringify(approveData)}`);
    console.log('Approve Quotation: Success');

    // 8. PO Generates PO
    const poCreateRes = await fetch(`${BASE_URL}/purchase-orders`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${poToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ approvalId: approvalId })
    });
    const poCreateData = await poCreateRes.json();
    if (!poCreateRes.ok) throw new Error(`Generate PO failed: ${JSON.stringify(poCreateData)}`);
    const poId = poCreateData.data._id;
    console.log('Generate PO: Success', poId);

    // 9. PO Generates Invoice (Vendor or PO?) User says PO generate invoice button.
    const invRes = await fetch(`${BASE_URL}/invoices`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${poToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ poId: poId })
    });
    const invData = await invRes.json();
    if (!invRes.ok) throw new Error(`Generate Invoice failed: ${JSON.stringify(invData)}`);
    console.log('Generate Invoice: Success', invData.data._id);

    console.log('--- Flow Test Completed Successfully ---');
  } catch (error) {
    console.error('Flow Test Error:', error.message);
  }
}

testFlow();
