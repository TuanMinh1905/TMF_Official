# TMF (TuanMinh Fashion) — Summary

> File nay mo ta tong quan he thong. Bat ky conversation nao doc file nay deu se hieu ro project.

## Tong quan
TMF la website thuong mai dien tu thoi trang unisex phong cach Seoul Earth. Project duoc xay dung voi muc dich hoc tap cac concept backend nang cao: Infrastructure, Cron Job, Worker, Queue, Outbox Pattern, Sandbox, Admin Dashboard.

## Tech Stack
| Layer | Cong nghe |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS v3 + Zustand + React Router |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Cache/Queue | Redis + BullMQ + IORedis |
| Container | Docker Compose (MongoDB + Redis + Mongo Express + Redis Commander) |
| Monorepo | npm workspaces |

## Cau truc thu muc
```
TMF_Official/
├── docker-compose.yml        # MongoDB + Redis + dev tools (profiles)
├── package.json              # Root workspace
├── .env / .env.example       # Bien moi truong
├── docs/
│   ├── SUMMARY.md            # File nay
│   ├── CODE_RULES.md         # Quy tac code
│   └── design/               # File design goc (V3 + V4)
├── packages/
│   ├── client/               # Frontend React
│   │   ├── src/
│   │   │   ├── pages/        # 13 page components (SPA routing)
│   │   │   │   ├── HomePage, CatalogPage, ProductPage
│   │   │   │   ├── LookbookPage, WishlistPage
│   │   │   │   ├── CartPage, CheckoutPage, SuccessPage
│   │   │   │   ├── LoginPage, RegisterPage, AccountPage, OrdersPage
│   │   │   │   └── AdminPage                    # [GD5] Admin Dashboard
│   │   │   ├── components/   # React components
│   │   │   │   ├── layout/   # PromoBar, Navbar, RouteBar, Footer, ScrollToTop
│   │   │   │   ├── home/     # Hero, PaletteStrip, Categories, Lookbook, Manifesto, Perks
│   │   │   │   ├── shop/     # ProductGrid, ProductCard, ProductVCard, Filters, FilterPanel
│   │   │   │   ├── cart/     # CartDrawer, CartRow, OrderSummary
│   │   │   │   ├── product/  # ProductDetail, SizeSelector
│   │   │   │   ├── account/  # AccountMenu, OrderCard
│   │   │   │   ├── admin/    # [GD5] StatCard, AdminNav, OrderTable, ProductTable, SystemPanel
│   │   │   │   ├── search/   # SearchModal
│   │   │   │   ├── ui/       # Modal, Toast, RuleButton
│   │   │   │   └── svg/      # GarmentSVG, EditorialSVG
│   │   │   ├── store/        # Zustand stores (cart, product, ui, auth, admin)
│   │   │   ├── data/         # Fallback products, section rules
│   │   │   └── utils/        # Format helpers
│   │   └── ...config files
│   └── server/               # Backend Express
│       ├── src/
│       │   ├── config/       # DB, Redis, env, sandbox, shutdown
│       │   │   ├── db.js     # MongoDB connection
│       │   │   ├── env.js    # Bien moi truong
│       │   │   ├── redis.js  # IORedis connection (BullMQ)
│       │   │   ├── sandbox.js    # [GD4] Sandbox mode middleware
│       │   │   └── shutdown.js   # [GD4] Graceful shutdown
│       │   ├── crons/        # [GD3] Cron jobs dinh ky
│       │   │   ├── outboxProcessor.js  # Quet Outbox pending moi 30s
│       │   │   ├── abandonedCartCron.js # Gio hang bo quen moi 60s
│       │   │   └── dailyReportCron.js   # Bao cao ngay moi 2 phut
│       │   ├── queues/       # BullMQ queue definitions
│       │   │   ├── orderQueue.js   # Queue "order-processing"
│       │   │   ├── emailQueue.js   # Queue "email-notification"
│       │   │   └── reportQueue.js  # [GD3] Queue "daily-report"
│       │   ├── workers/      # BullMQ workers (xu ly bat dong bo)
│       │   │   ├── orderWorker.js  # Xu ly don hang: pending → completed
│       │   │   ├── emailWorker.js  # Gui email xac nhan (console.log)
│       │   │   └── reportWorker.js # [GD3] Tao bao cao ngay
│       │   ├── models/       # Product, Cart, Order, Outbox
│       │   ├── controllers/  # CRUD logic + queue dispatch + stats
│       │   │   ├── productController.js
│       │   │   ├── cartController.js
│       │   │   ├── orderController.js
│       │   │   └── statsController.js  # [GD3] Dashboard stats + Outbox status
│       │   ├── routes/       # API routes
│       │   │   ├── productRoutes.js
│       │   │   ├── cartRoutes.js
│       │   │   ├── orderRoutes.js
│       │   │   └── statsRoutes.js      # [GD3] /api/stats/*
│       │   └── middleware/   # Error handler, rate limiter, request logger
│       │       ├── errorHandler.js
│       │       ├── rateLimiter.js      # [GD4] In-memory rate limiter
│       │       └── requestLogger.js    # [GD4] Dev request logger
│       └── seed/             # Seed 8 san pham
```

## Routing (React Router)
| Route | Page | Mo ta |
|-------|------|-------|
| / | HomePage | Landing page day du |
| /catalog | CatalogPage | Product listing voi sidebar filter (danh muc, gia, mau, search) |
| /product/:id | ProductPage | Chi tiet san pham (thumbnails, size, accordion, related) |
| /lookbook | LookbookPage | 3 editorial looks (olive, denim, rose) |
| /wishlist | WishlistPage | Danh sach yeu thich |
| /cart | CartPage | Gio hang day du (+/- qty, coupon, summary) |
| /checkout | CheckoutPage | Form 3 buoc (lien he, dia chi, thanh toan) |
| /login | LoginPage | Dang nhap demo |
| /register | RegisterPage | Dang ky demo |
| /account | AccountPage | Thong tin ca nhan + don hang gan day |
| /orders | OrdersPage | Danh sach don hang + timeline tracking |
| /success | SuccessPage | Xac nhan dat hang thanh cong |
| /admin | AdminPage | [GD5] Admin Dashboard (4 tabs: tong quan, don hang, san pham, he thong) |

## API Endpoints
| Method | Endpoint | Mo ta |
|--------|----------|-------|
| GET | /api/health | Health check + cron status + sandbox mode |
| GET | /api/products | Danh sach san pham (filter: type, gender, search, sort, tag) |
| GET | /api/products/:id | Chi tiet san pham |
| POST | /api/cart | Them vao gio hang |
| GET | /api/cart/:sessionId | Xem gio hang |
| PUT | /api/cart/:sessionId/items/:itemId | Cap nhat so luong |
| DELETE | /api/cart/:sessionId/items/:itemId | Xoa san pham khoi gio |
| POST | /api/orders | Dat hang |
| GET | /api/orders | [GD5] Danh sach tat ca don hang |
| GET | /api/orders/:id | Xem don hang |
| GET | /api/stats/dashboard | [GD3] Thong ke tong quan (products, orders, revenue, by status) |
| GET | /api/stats/outbox | [GD3] Trang thai Outbox (grouped by status) |

## Zustand Stores
| Store | Chuc nang |
|-------|-----------| 
| productStore | products[], fetchProducts(), filter, sort, search, favorites, getFiltered() |
| cartStore | items[], addItem(), removeItem(), updateQty(), clearCart(), getCount(), getSubtotal() |
| uiStore | productDetailId, searchOpen, toast, openProductDetail(), showToast() |
| authStore | user, login(), register(), logout(), updateProfile(), isLoggedIn() |
| adminStore | [GD5] stats, orders, products, outbox, activeTab, fetchStats/Orders/Products/Outbox() |

## Tinh nang da hoan thanh
- [x] Landing page day du theo design FORM. Seoul Earth V3
- [x] Multi-page SPA voi React Router (13 trang tu design V4 + admin)
- [x] Product catalog voi sidebar filter (danh muc, gia, mau sac, search)
- [x] Product detail page (doi mau, chon size, accordion, related products)
- [x] Lookbook page (3 editorial looks)
- [x] Wishlist page
- [x] Cart page day du (qty +/-, coupon FORM10, order summary)
- [x] Checkout page (3-panel form, COD/chuyen khoan)
- [x] Order success + order tracking page (timeline 4 buoc)
- [x] Login/Register demo (localStorage)
- [x] Account page (profile, don hang gan day)
- [x] RouteBar navigation
- [x] SVG garment illustrations (tee, polo, shirt, jeans, hoodie, cardigan, bag)
- [x] SVG editorial illustrations (hero, lookbook)
- [x] Product detail modal (homepage)
- [x] Cart drawer (homepage - localStorage)
- [x] Search modal
- [x] Nut Quy tac (RuleButton) tren moi section
- [x] Backend REST API (Products, Cart, Orders)
- [x] Outbox model (san sang cho giai doan sau)
- [x] Seed data 8 san pham
- [x] Docker Compose (MongoDB + Redis)
- [x] Responsive mobile/desktop
- [x] BullMQ Queue & Worker (Order Worker, Email Worker)
- [x] Redis connection dung chung (IORedis)
- [x] Order xu ly bat dong bo: pending → processing → completed
- [x] Email xac nhan don hang (console.log gia lap)
- [x] Retry mechanism (3 lan, exponential backoff)
- [x] Graceful degradation khi Redis down

### Giai doan 3: Cron Job & Outbox ✅
- [x] Outbox Processor — quet Outbox pending moi 30s, day lai job vao queue
- [x] Abandoned Cart Cron — phat hien gio hang bo quen (>30 phut), tao Outbox event
- [x] Daily Report Cron — tong hop don hang, doanh thu, top san pham (2 phut/lan demo)
- [x] Report Queue & Report Worker — xu ly bao cao qua BullMQ
- [x] Stats API — /api/stats/dashboard (thong ke tong quan), /api/stats/outbox (outbox status)
- [x] Orders list API — GET /api/orders (danh sach tat ca don hang)

### Giai doan 4: Sandbox & Infra ✅
- [x] Docker Compose profiles — dev profile voi Mongo Express (8081) va Redis Commander (8082)
- [x] Sandbox Mode — SANDBOX_MODE=true chan POST/PUT/DELETE, chi cho GET
- [x] Rate Limiter — in-memory, 100 req/phut/IP, tra 429 khi vuot nguong
- [x] Request Logger — [API] METHOD /path STATUS TIMEms (chi development)
- [x] Graceful Shutdown — SIGINT/SIGTERM dong cron, HTTP, Redis, MongoDB an toan
- [x] .env.example — mau bien moi truong day du
- [x] npm scripts moi: docker:dev, docker:dev:down, docker:logs

### Giai doan 5: Admin Dashboard ✅
- [x] Admin page (/admin) — 4 tabs: Tong quan, Don hang, San pham, He thong
- [x] Stat cards — tong san pham, don hang, doanh thu, don hoan thanh
- [x] Order table — sortable, expandable rows, status badges (mau theo trang thai)
- [x] Product table — danh sach san pham, trang thai kho (con/het hang)
- [x] System panel — Outbox monitor, Cron Job info, Queue & Worker info
- [x] Admin store (Zustand) — fetchStats, fetchOrders, fetchProducts, fetchOutbox
- [x] Admin nav link tren Navbar (icon gear)
- [x] RuleButton cho admin, cronJobs, sandbox sections

## Giai doan tiep theo
- [x] Giai doan 2: Queue & Worker (BullMQ, Order Worker, Email Worker)
- [x] Giai doan 3: Cron Job & Outbox (Outbox Processor, Abandoned Cart, Daily Report)
- [x] Giai doan 4: Sandbox & Infra (Docker profiles, Sandbox mode, Rate Limiter, Graceful Shutdown)
- [x] Giai doan 5: Admin Dashboard (4 tabs, stats, orders, products, system monitoring)

## Cach chay
```bash
# 1. Start MongoDB + Redis
docker-compose up -d

# 1b. (Optional) Start voi dev tools: Mongo Express + Redis Commander
npm run docker:dev

# 2. Cai dependencies
npm install

# 3. Seed data
npm run seed

# 4. Chay backend
npm run dev:server

# 5. Chay frontend (tab khac)
npm run dev:client

# Truy cap: http://localhost:3000
# Admin:   http://localhost:3000/admin
# Mongo Express (dev): http://localhost:8081
# Redis Commander (dev): http://localhost:8082
```
