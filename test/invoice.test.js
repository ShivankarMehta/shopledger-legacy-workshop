const assert = require('node:assert/strict');
const test = require('node:test');
const invoice = require('../lib/invoice');
const reports = require('../lib/reports');

test('invoice applies the SAVE10 cap before calculating GST', () => {
  const result = invoice.computeInvoiceFigures({
    coupon: 'SAVE10',
    items: [{ id: 5, name: 'Groundnut oil', hsn: '1508', price: 1120, qty: 2 }],
  });
  assert.equal(result.discount, 150);
  assert.equal(result.tax, 104.5);
  assert.equal(result.total, 2194.5);
});

test('an 18% item with no coupon matches checkout', () => {
  const result = invoice.computeInvoiceFigures({
    items: [{ id: 2, name: 'Tea', hsn: '0902', price: 100, qty: 1 }],
  });
  assert.equal(result.tax, 18);
  assert.equal(result.total, 118);
  assert.equal(result.cgst + result.sgst, result.tax);
});

test('invoice matches the amount charged for a discounted 5% order', () => {
  const result = invoice.computeInvoiceFigures({
    coupon: 'SAVE10',
    items: [{ id: 1, name: 'Rice', hsn: '1006', price: 1020, qty: 1 }],
  });
  assert.equal(result.total, 963.9);
  assert.equal(result.discount, 102);
  assert.equal(result.tax, 45.9);
  assert.equal(result.cgst, 22.95);
  assert.equal(result.sgst, 22.95);
  assert.equal(result.rows[0].gstPercent, 5);
  assert.equal(result.rows[0].lineTax, 45.9);
});

test('mixed HSN rates render correctly and reconcile with the ledger', () => {
  const order = {
    id: 1007,
    subtotal: 1280,
    discount: 0,
    tax: 127,
    total: 1407,
    items: [
      { id: 6, sku: 'DRY-001', name: 'Ghee', hsn: '0405', price: 450, qty: 2 },
      { id: 4, sku: 'OIL-001', name: 'Cooking oil', hsn: '1512', price: 190, qty: 2 },
    ],
  };
  const result = invoice.computeInvoiceFigures(order);
  assert.deepEqual(result.rows.map(row => [row.sku, row.gstPercent, row.lineTax]), [
    ['DRY-001', 12, 108],
    ['OIL-001', 5, 19],
  ]);
  assert.equal(result.total, 1407);
  assert.equal(reports.getGstReconciliation({ orders: [order] }).mismatchCount, 0);
  assert.doesNotMatch(invoice.render(order), /Accountant Reconciliation Notice/);
  assert.equal(reports.getGstReconciliation({ orders: [{ ...order, total: 1408 }] }).mismatchCount, 1);
});
