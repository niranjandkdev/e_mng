# Marketly – Mini E-Commerce Application (MERN)

A full-stack store where users browse products, search, filter, sort, open a product page, manage a cart and place an order. Built with **MongoDB, Express, React (Vite) and Node.js**.

## Features

| Requirement | Implementation |
|---|---|
| Product listing (name, price, category, stock, image) | `client/src/pages/Products.jsx`, `GET /api/products` |
| Search by name | Debounced search box (350 ms), case-insensitive regex on the server |
| Filter by category | Dropdown plus quick chips, categories loaded from the database |
| Sort by price | Low to high, high to low, or newest |
| Product details page | `/product/:id` with quantity picker and related products |
| Add to cart | Cart context, saved in `localStorage`, quantity capped at stock |
| Place an order | Checkout form, `POST /api/orders`, order confirmation page |

### Extras
- **Shareable URLs**: search, category, sort and page live in the URL (`/?category=Books&sort=price_asc`).
- **Oversell protection**: stock is decremented atomically on the server (`findOneAndUpdate` with `stock >= qty`). If any item fails, earlier reservations are rolled back.
- **Stock badges**: "In stock", "Only N left", "Out of stock" (add-to-cart disabled).
- Pagination, loading skeletons, empty and error states, toast on add-to-cart.
- Dark mode toggle, responsive layout, keyboard focus styles.

## Project structure

```
mini-ecommerce/
├── package.json            helper scripts
├── server/                 Express + Mongoose API
│   ├── server.js
│   ├── seed.js             inserts 16 sample products
│   ├── .env                MongoDB connection string
│   ├── models/             Product.js, Order.js
│   └── routes/             products.js, orders.js
└── client/                 React (Vite) app
    └── src/
        ├── App.jsx, main.jsx, api.js, CartContext.jsx, styles.css
        └── pages/          Products, ProductDetail, Cart, OrderSuccess
```

## Prerequisites
1. **Node.js 18 or newer** (check with `node -v`)
2. **MongoDB Community Server** running locally, and **MongoDB Compass** to view the data
3. An internet connection (product images come from picsum.photos, fonts from Google Fonts)

## How to run

### 1. Start MongoDB and connect Compass
- Make sure the MongoDB service is running (Windows: it starts automatically after install; macOS: `brew services start mongodb-community`; Linux: `sudo systemctl start mongod`).
- Open Compass and connect to `mongodb://127.0.0.1:27017`.

### 2. Install dependencies
Open a terminal in the project folder:
```bash
npm run install:all
```
(or run `npm install` separately inside `server` and `client`).

### 3. Check the environment file
`server/.env` already contains:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mini_ecommerce
```
If you use MongoDB Atlas or another host, paste the connection string from Compass into `MONGO_URI`.

### 4. Seed the database
```bash
npm run seed
```
You should see `Seeded 16 products`. In Compass, refresh and open the `mini_ecommerce` database to see the `products` collection. Run the seed again any time to reset products.

### 5. Start the backend (terminal 1)
```bash
npm run server
```
Expect: `MongoDB connected` and `API running on http://localhost:5000`.

### 6. Start the frontend (terminal 2)
```bash
npm run client
```
Open **http://localhost:5173**.

## API reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products?search=&category=&sort=price_asc\|price_desc&page=&limit=` | List with search, filter, sort and pagination |
| GET | `/api/products/categories` | Distinct categories |
| GET | `/api/products/:id` | Product plus related products |
| POST | `/api/orders` | Body: `{ customer:{name,email,address}, items:[{id,qty}] }` |
| GET | `/api/orders/:id` | Order details |
| GET | `/api/health` | Server check |

## Testing the flow
1. Search "desk" and the list narrows to Desk Lamp.
2. Pick **Books** and sort **Price: low to high**.
3. Open a product, set a quantity, and add it to the cart.
4. Smart Watch has 0 stock, so its button is disabled.
5. In the cart, change quantities, enter details and place the order.
6. In Compass, check `orders` (new document) and `products` (stock reduced).

## Troubleshooting
- **`MongoDB connection failed`**: MongoDB is not running, or `MONGO_URI` is wrong. Use `127.0.0.1` instead of `localhost` if needed.
- **Products fail to load in the browser**: start the backend first. The Vite dev server proxies `/api` to port 5000.
- **Port already in use**: change `PORT` in `server/.env` and the proxy target in `client/vite.config.js`.
- **Images missing**: you are offline. Replace the `image` URLs in `seed.js` with local images and re-seed.

## Ideas for extension
User login with JWT, an admin page to add or edit products, payment integration, order history, and product reviews.
