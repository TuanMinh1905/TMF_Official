# TMF (TuanMinh Fashion) — Summary

> File nay mo ta tong quan he thong. Bat ky conversation nao doc file nay deu se hieu ro project.

## Tong quan
TMF la website thuong mai dien tu thoi trang unisex phong cach Seoul Earth. Project duoc xay dung voi muc dich hoc tap cac concept backend nang cao: Infrastructure, Cron Job, Worker, Queue, Outbox Pattern, Sandbox.

## Tech Stack
| Layer | Cong nghe |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS v3 + Zustand + React Router |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Cache/Queue | Redis + BullMQ + IORedis |
| Container | Docker Compose (MongoDB + Redis) |
| Monorepo | npm workspaces |

## Cau truc thu muc
```
TMF_Official/
├── docker-compose.yml        # MongoDB + Redis
├── package.json              # Root workspace
├── .agent                    # Quy tac agent
├── .env / .env.example       # Bien moi truong
├── docs/
│   ├── SUMMARY.md            # File nay
│   ├── CODE_RULES.md         # Quy tac code
│   └── design/               # File design goc (V3 + V4)
├── packages/
│   ├── client/               # Frontend React
│   │   ├── src/
│   │   │   ├── pages/        # 12 page components (SPA routing)
│   │   │   │   ├── HomePage, CatalogPage, ProductPage
│   │   │   │   ├── LookbookPage, WishlistPage
│   │   │   │   ├── CartPage, CheckoutPage, SuccessPage
│   │   │   │   └── LoginPage, RegisterPage, AccountPage, OrdersPage
│   │   │   ├── components/   # React components
│   │   │   │   ├── layout/   # PromoBar, Navbar, RouteBar, Footer, ScrollToTop
│   │   │   │   ├── home/     # Hero, PaletteStrip, Categories, Lookbook, Manifesto, Perks
│   │   │   │   ├── shop/     # ProductGrid, ProductCard, ProductVCard, Filters, FilterPanel
│   │   │   │   ├── cart/     # CartDrawer, CartRow, OrderSummary
│   │   │   │   ├── product/  # ProductDetail, SizeSelector
│   │   │   │   ├── account/  # AccountMenu, OrderCard
│   │   │   │   ├── search/   # SearchModal
│   │   │   │   ├── ui/       # Modal, Toast, RuleButton
│   │   │   │   └── svg/      # GarmentSVG, EditorialSVG
│   │   │   ├── store/        # Zustand stores (cart, product, ui, auth)
│   │   │   ├── data/         # Fallback products, section rules
│   │   │   └── utils/        # Format helpers
│   │   └── ...config files
│   └── server/               # Backend Express
│       ├── src/
│       │   ├── config/       # DB, Redis, env, sandbox, shutdown config
│       │   │   ├── db.js       # MongoDB connection
│       │   │   ├── env.js      # Bien moi truong
│       │   │   ├── redis.js    # IORedis connection (BullMQ)
│       │   │   ├── sandbox.js  # Sandbox mode (read-only middleware)
│       │   │   └── shutdown.js # Graceful shutdown (SIGINT/SIGTERM)
│       │   ├── queues/       # BullMQ queue definitions
│       │   │   ├── orderQueue.js   # Queue "order-processing"
│       │   │   ├── emailQueue.js   # Queue "email-notification"
│       │   │   └── reportQueue.js  # Queue "daily-report"
│       │   ├── workers/      # BullMQ workers (xu ly bat dong bo)
│       │   │   ├── orderWorker.js  # Xu ly don hang: pending → completed
│       │   │   ├── emailWorker.js  # Gui email xac nhan (console.log)
│       │   │   └── reportWorker.js # Tao bao cao ngay tu reportQueue
│       │   ├── crons/        # Cron jobs (setInterval)
│       │   │   ├── outboxProcessor.js   # Quet Outbox pending moi 30s
│       │   │   ├── abandonedCartCron.js # Phat hien gio hang bo quen > 30p
│       │   │   └── dailyReportCron.js   # Bao cao doanh thu/don hang ngay
│       │   ├── models/       # Product, Cart, Order, Outbox
│       │   ├── controllers/  # CRUD logic + queue dispatch + stats
│       │   ├── routes/       # API routes (products, cart, orders, stats)
│       │   └── middleware/   # Error handler, rateLimiter, requestLogger
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

## API Endpoints
| Method | Endpoint | Mo ta |
|--------|----------|-------|
| GET | /api/health | Health check |
| GET | /api/products | Danh sach san pham (filter: type, gender, search, sort, tag) |
| GET | /api/products/:id | Chi tiet san pham |
| POST | /api/cart | Them vao gio hang |
| GET | /api/cart/:sessionId | Xem gio hang |
| PUT | /api/cart/:sessionId/items/:itemId | Cap nhat so luong |
| DELETE | /api/cart/:sessionId/items/:itemId | Xoa san pham khoi gio |
| POST | /api/orders | Dat hang |
| GET | /api/orders/:id | Xem don hang |
| GET | /api/stats/dashboard | Thong ke tong quan (san pham, don hang, doanh thu, trang thai) |
| GET | /api/stats/outbox | Danh sach ban ghi Outbox nhom theo trang thai |

## Zustand Stores
| Store | Chuc nang |
|-------|-----------|
| productStore | products[], fetchProducts(), filter, sort, search, favorites, getFiltered() |
| cartStore | items[], addItem(), removeItem(), updateQty(), clearCart(), getCount(), getSubtotal() |
| uiStore | productDetailId, searchOpen, toast, openProductDetail(), showToast() |
| authStore | user, login(), register(), logout(), updateProfile(), isLoggedIn() |

## Tinh nang da hoan thanh
- [x] Landing page day du theo design FORM. Seoul Earth V3
- [x] Multi-page SPA voi React Router (12 trang tu design V4)
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
- [x] Docker Compose (MongoDB + Redis + profile dev: Mongo Express, Redis Commander)
- [x] Responsive mobile/desktop
- [x] BullMQ Queue & Worker (Order Worker, Email Worker)
- [x] Redis connection dung chung (IORedis)
- [x] Order xu ly bat dong bo: pending → processing → completed
- [x] Email xac nhan don hang (console.log gia lap)
- [x] Retry mechanism (3 lan, exponential backoff)
- [x] Graceful degradation khi Redis down
- [x] Outbox Processor (quet Outbox pending moi 30s, khoi phuc ORDER_CREATED khi Redis phuc hoi)
- [x] Abandoned Cart Cron (phat hien gio hang > 30 phut, tao su kien CART_ABANDONED trong Outbox)
- [x] Daily Report Cron + Report Queue/Worker (thong ke don hang, doanh thu, top san pham)
- [x] Admin Stats API (`/api/stats/dashboard`, `/api/stats/outbox`) va `/api/health` cron status
- [x] Sandbox Mode (read-only middleware qua SANDBOX_MODE)
- [x] In-memory Rate Limiter middleware (Map theo IP, 429 khi vuot nguong)
- [x] Request Logger middleware ([API] METHOD /path STATUS TIMEms trong dev)
- [x] Graceful Shutdown (SIGINT/SIGTERM dong HTTP, cron, Redis, MongoDB)

## Giai doan tiep theo
- [x] Giai doan 2: Queue & Worker (BullMQ, Order Worker, Email Worker)
- [x] Giai doan 3: Cron Job & Outbox (Nhac gio hang bo quen, Bao cao ngay)
- [x] Giai doan 4: Sandbox & Infra (Docker profiles, Sandbox mode, Rate Limiter, Request Logger, Graceful Shutdown)
- [ ] Giai doan 5: Admin Dashboard

## Cach chay
```bash
# 1. Start MongoDB + Redis (hoac dung docker:dev de mo them Mongo Express 8081 & Redis Commander 8082)
npm run docker:up
# npm run docker:dev

# 2. Cai dependencies
npm install

# 3. Seed data
npm run seed

# 4. Chay backend
npm run dev:server

# 5. Chay frontend (tab khac)
npm run dev:client

# Truy cap: http://localhost:3000
```
