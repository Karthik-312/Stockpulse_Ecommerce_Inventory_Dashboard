# StockPulse Ecommerce

A full-stack ecommerce application powered by the StockPulse Inventory Management System. Products, stock levels, and prices are synced in real-time from the inventory microservice.

## Architecture

```
┌─────────────────┐       ┌─────────────────────┐       ┌──────────────────────┐
│  React Frontend │──────▶│  Ecommerce Backend  │──────▶│  StockPulse Inventory│
│   (Port 3000)   │ /api  │   (Port 9090)       │ REST  │     (Port 8080)      │
└─────────────────┘       └─────────────────────┘       └──────────────────────┘
```

- **Frontend** — React 19, TypeScript, Vite, Tailwind CSS 4
- **Ecommerce Backend** — Spring Boot 3.3, Java, H2 Database, JWT Auth
- **StockPulse Inventory API** — Separate microservice (source of truth for products)

## Features

- Real-time product catalog synced from StockPulse Inventory
- User registration and JWT-based authentication
- Shopping cart with quantity management
- Order placement with automatic stock adjustment
- Category-based filtering and product search
- Responsive Zepto-inspired UI design
- Prices in INR (₹) sourced directly from inventory

## Prerequisites

- Java 19+ (for both backends)
- Node.js 18+ (for frontend)
- StockPulse Inventory API running on port 8080

## Getting Started

### 1. Start StockPulse Inventory API (Port 8080)

```bash
cd <path-to-stockpulse-inventory>/backend
./gradlew bootRun
```

### 2. Start Ecommerce Backend (Port 9090)

```bash
cd ecommerce-backend
./gradlew bootRun
```

### 3. Start Frontend (Port 3000)

```bash
cd ecommerce-frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Stockpulse-Ecommerce/
├── ecommerce-frontend/          # React + Vite frontend
│   └── src/
│       ├── api/                  # Axios API client
│       ├── components/           # Navbar, ProductCard, Footer
│       ├── context/              # Auth context (JWT)
│       ├── pages/                # Home, ProductDetail, Cart, Checkout, Orders
│       └── types/                # TypeScript interfaces
│
├── ecommerce-backend/           # Spring Boot backend (BFF)
│   └── src/main/java/.../
│       ├── controller/           # REST controllers
│       ├── service/              # Business logic + StockPulse client
│       ├── model/                # JPA entities
│       ├── dto/                  # Data transfer objects
│       ├── repository/           # Spring Data JPA repos
│       ├── config/               # CORS, Security, RestTemplate
│       └── security/             # JWT filter and utilities
│
└── README.md
```

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get product details |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |

### Authenticated (Bearer Token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart items |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:id` | Update item quantity |
| DELETE | `/api/cart/:id` | Remove item from cart |
| POST | `/api/orders/checkout` | Place order |
| GET | `/api/orders` | Get order history |

## How It Works

1. **Product Sync** — The ecommerce backend fetches products from StockPulse Inventory API (`GET /api/inventory`) on every request. No local product cache.

2. **Pricing** — Prices come directly from the inventory service's `price` field. Products without prices show "Price not set".

3. **Stock Management** — When an order is placed, the backend calls `POST /api/inventory/:id/adjust` to decrement stock in the inventory system.

4. **Authentication** — Users register/login to get a JWT token. Cart and orders are user-specific.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS 4, Vite 6 |
| UI Components | Lucide React icons, React Hot Toast |
| Routing | React Router DOM v6 |
| HTTP Client | Axios |
| Backend | Spring Boot 3.3, Spring Security, Spring Data JPA |
| Database | H2 (in-memory for ecommerce data) |
| Auth | JWT (HS256) |
| Inter-service | RestTemplate to StockPulse API |
