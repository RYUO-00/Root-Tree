# Roots & Trees Product Explorer (React + Vite)

Problem statement: **Making Product Information Clear and Easy to Understand for Online Customers**.

## Run it
```bash
npm install
npm run dev        # open the local URL shown in the terminal
npm test           # 21 unit tests (Node's built-in runner)
npm run build      # production build in /dist
```
Needs Node.js 18 or newer.

## Structure
```
src/
  main.jsx              entry point
  App.jsx               shared state: page, open product, category, cart
  styles.css            all styling
  data/products.js      local sample data (6 products, forms, variants)
  utils/logic.js        pure functions (price, filter, cart) - unit tested
  utils/storage.js      cart saved in localStorage
  components/           Header, Home, Catalogue, ProductCard, ProductDetail, Cart, Pack
tests/logic.test.js     unit tests
docs/                   project report (Word) and screenshots
```
All product names, prices and delivery details are sample data. There is no backend:
PostgreSQL + Express are the planned next phase, not part of this MVP.
