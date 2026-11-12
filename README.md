# StockPulse Ecommerce

Customer-facing **storefront** that reads catalog, price, and stock from the **StockPulse Inventory** API. Cart, checkout, and orders live in this app’s database; stock decrements go back to inventory over REST with **`X-Api-Key`**.

**Spring Boot BFF** · **React (Vite)** UI · **Render** (API + PostgreSQL) · **Vercel** (storefront via `/api` proxy).

## Architecture

```
┌─────────────────────┐       ┌─────────────────────────┐       ┌──────────────────────────┐
│  React storefront   │──────▶│  Ecommerce backend      │──────▶│  StockPulse Inventory    │
│  (Vite, port 3000)  │ /api  │  (Spring Boot, 9090)    │ REST  │  (source of truth, 8080) │
└─────────────────────┘       └─────────────────────────┘       └──────────────────────────┘
```

| Piece | Role |
|-------|------|
| **Inventory API** | Products, SKUs, stock, prices, images, discounts |
| **Ecommerce API** | Users (JWT), cart, orders; proxies catalog from inventory |
| **Storefront** | Browse, search, cart, checkout; calls same-origin `/api` (proxied in prod) |

## Features

### Storefront
- **Live catalog** — names, categories, stock status, **product images**, **final price** and discount % from inventory
- **Search & category chips** — filter the grid; hero categories with icons
- **Product detail** — stock-aware add-to-cart
- **Dark / light theme** — persisted in `localStorage`
- **Resilient loading** — client retries on 5xx; “slow load” hint when Render is waking

### Checkout & account
- **Register / login** — JWT (Bearer) for cart and orders
- **Cart** — quantity updates, remove lines
- **Checkout** — creates order locally, calls inventory **`adjustStock`** per line item
- **Order history** — past orders for the signed-in user
- **Auto-refresh** — catalog refreshes after checkout via `order-placed` event

### Backend integration
- **`StockPulseClient`** — `RestTemplate`, optional **`X-Api-Key`**, retries, **5-minute in-memory cache** (invalidated on stock adjust; stale cache if inventory is down)
- **PostgreSQL** in production (Neon via Render); **H2** locally for users/cart/orders

## Tech stack

| Layer | Technology |
|-------|------------|
| Storefront | React 19, TypeScript, Vite 6, Tailwind CSS 4, React Router, Axios |
| Ecommerce API | Java 17, Spring Boot 3.3, Spring Security, Spring Data JPA, JWT (jjwt), Actuator |
| Data | H2 (local) · PostgreSQL (prod) |
| Inventory link | REST — `GET /api/inventory`, `POST .../adjust?delta=` |
| Hosting | [Render](https://render.com) (`render.yaml`) · [Vercel](https://vercel.com) (`ecommerce-frontend/vercel.json`) |

## Project structure

```
Stockpulse-Ecommerce/
├── ecommerce-frontend/     # React storefront (Vercel root)
│   ├── vercel.json           # Proxies /api → Render ecommerce API
│   └── src/
├── ecommerce-backend/        # Spring Boot BFF (Docker on Render)
│   └── src/main/resources/
│       ├── application.yml
│       └── application-prod.yml
├── render.yaml
└── README.md
```

## Run locally

Prerequisites: **JDK 17+**, **Node 18+**, and **StockPulse Inventory** on port **8080**.

### 1. Inventory API

```bash
cd <path-to-stockpulse-inventory>/backend
./gradlew bootRun          # Linux/macOS
gradlew.bat bootRun        # Windows
```

### 2. Ecommerce backend (port 9090)

```bash
cd ecommerce-backend
./gradlew bootRun
gradlew.bat bootRun          # Windows
```

Optional: set `STOCKPULSE_API_KEY` if your inventory API enforces API keys for adjustments.

### 3. Storefront (port 3000)

```bash
cd ecommerce-frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The UI calls `http://localhost:9090/api` via the Vite dev proxy (see `vite.config.ts`).

## Environment variables

### Ecommerce backend (Render)

| Variable | Purpose |
|----------|---------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `STOCKPULSE_API_URL` | Inventory origin, e.g. `https://stockpulse-api-haxr.onrender.com` |
| `STOCKPULSE_API_KEY` | Same key inventory expects on `X-Api-Key` for `adjust` |
| `JWT_SECRET` | HS256 signing secret (generated on Render if omitted in blueprint) |
| `CORS_ALLOWED_ORIGINS` | Storefront origin(s), e.g. your Vercel URL |
| `DB_*` | PostgreSQL (from Render managed DB in `render.yaml`) |

### Storefront (Vercel)

Root directory: **`ecommerce-frontend`**.  
`vercel.json` rewrites **`/api/*`** to the Render ecommerce API — no `VITE_*` URL needed for production.

For local dev, rely on the Vite proxy to `localhost:9090`.

## Live endpoints

| Service | URL |
|---------|-----|
| Ecommerce API | https://stockpulse-ecommerce-api.onrender.com |
| Inventory API (catalog source) | https://stockpulse-api-haxr.onrender.com/api/inventory |
| Inventory dashboard | https://smart-replenish-warehouse-dashboard.vercel.app |

> **Render free tier** — first request after sleep can take ~30s; storefront and client retries account for cold starts.

## Deploy your own

1. **Inventory** — deploy [StockPulse Inventory](https://github.com/Karthik-312/-Smart-Replenish-Warehouse-Dashboard) (or your fork); note API URL and API key.
2. **Ecommerce API** — Render → **New Blueprint** → this repo → set `STOCKPULSE_API_KEY` and `CORS_ALLOWED_ORIGINS`.
3. **Storefront** — Vercel → import repo → **Root Directory** `ecommerce-frontend` → update `vercel.json` rewrite destination to your Render ecommerce URL.

## Storefront pages

| Route | Page | Login required |
|-------|------|----------------|
| `/` | Home — catalog, search, categories | No |
| `/products/:id` | Product detail | No |
| `/login` · `/register` | Auth | No |
| `/cart` | Cart | Yes |
| `/checkout` | Checkout | Yes |
| `/orders` | Order history | Yes |

## API endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (from inventory) |
| GET | `/api/products/:id` | Product detail |
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login → JWT |

### Authenticated (Bearer)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Cart |
| POST | `/api/cart` | Add line |
| PUT | `/api/cart/:id` | Update quantity |
| DELETE | `/api/cart/:id` | Remove line |
| POST | `/api/orders/checkout` | Place order + adjust inventory stock |
| GET | `/api/orders` | Order history |

## How it works

1. **Catalog** — `ProductService` maps inventory DTOs to storefront products (price, `finalPrice`, discount, `imageUrl`, in-stock flag).
2. **Cache** — `StockPulseClient` caches the full list for **5 minutes**; single-item cache shares that TTL; **adjustStock** clears cache.
3. **Checkout** — Order persisted in ecommerce DB; for each cart line, inventory stock adjusted by negative delta via API key when configured.
4. **Auth** — JWT in `Authorization: Bearer`; cart and orders scoped by customer email.

## Related

- **Inventory dashboard & API:** [StockPulse Inventory](https://github.com/Karthik-312/-Smart-Replenish-Warehouse-Dashboard) — manage SKUs, thresholds, and stock that appear in this store.
- **Health check:** `GET /actuator/health` on the ecommerce API (used by Render).
