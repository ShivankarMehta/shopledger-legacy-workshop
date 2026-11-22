# ShopLedger

ShopLedger is a CommonJS Node.js and Express 4 app with a static browser UI and a local JSON data file. The workshop uses Node.js 22 or newer.

## Module map

- `server.js` mounts static assets and API routes and serves printable invoices.
- `routes/` handles products, orders, customers, and reports.
- `lib/pricing.js`, `lib/tax.js`, and `lib/coupons.js` calculate checkout totals.
- `lib/invoice.js` renders invoices. `lib/reports.js` compares invoice and ledger figures.
- `lib/inventory.js`, `lib/orders.js`, `lib/ledger.js`, and `lib/dates.js` support stock, orders, credit, and date handling.
- `lib/store.js` reads and writes `data/db.json`. `config.js` provides shop and pricing configuration.

## Workshop commands

- `npm install` installs the existing dependencies. Leave the generated lockfile out of workshop commits.
- `npm start` serves the app on port 3000 unless `PORT` is set.
- `node --test` runs the workshop tests using Node's test runner.

## Workshop rules

- Write characterization tests before changing behavior.
- Change only the application modules needed by the selected ticket.
- Use in-memory test fixtures. Run manual flows that can write data in a disposable checkout. Keep `data/db.json` unchanged.
- Add no dependencies.
