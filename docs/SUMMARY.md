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
│       │   ├── config/       # DB, Redis, env config
│       │   │   ├── db.js     # MongoDB connection
│       │   │   ├── env.js    # Bien moi truong
│       │   │   └── redis.js  # IORedis connection (BullMQ)
│       │   ├── queues/       # BullMQ queue definitions
│       │   │   ├── orderQueue.js   # Queue "order-processing"
│       │   │   └── emailQueue.js   # Queue "email-notification"
│       │   ├── workers/      # BullMQ workers (xu ly bat dong bo)
│       │   │   ├── orderWorker.js  # Xu ly don hang: pending → completed
│       │   │   └── emailWorker.js  # Gui email xac nhan (console.log)
│       │   ├── models/       # Product, Cart, Order, Outbox
│       │   ├── controllers/  # CRUD logic + queue dispatch
│       │   ├── routes/       # API routes
│       │   └── middleware/   # Error handler
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
- [x] Docker Compose (MongoDB + Redis)
- [x] Responsive mobile/desktop
- [x] BullMQ Queue & Worker (Order Worker, Email Worker)
- [x] Redis connection dung chung (IORedis)
- [x] Order xu ly bat dong bo: pending → processing → completed
- [x] Email xac nhan don hang (console.log gia lap)
- [x] Retry mechanism (3 lan, exponential backoff)
- [x] Graceful degradation khi Redis down

## Giai doan tiep theo
- [x] Giai doan 2: Queue & Worker (BullMQ, Order Worker, Email Worker)
- [ ] Giai doan 3: Cron Job & Outbox (Nhac gio hang bo quen, Bao cao ngay)
- [ ] Giai doan 4: Sandbox & Infra (Docker profiles, Sandbox mode)
- [ ] Giai doan 5: Admin Dashboard

## Cach chay
```bash
# 1. Start MongoDB + Redis
docker-compose up -d

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
