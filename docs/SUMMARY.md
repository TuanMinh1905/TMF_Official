# TMF (TuanMinh Fashion) — Summary

> File nay mo ta tong quan he thong. Bat ky conversation nao doc file nay deu se hieu ro project.

## Tong quan
TMF la website thuong mai dien tu thoi trang unisex phong cach Seoul Earth. Project duoc xay dung voi muc dich hoc tap cac concept backend nang cao: Infrastructure, Cron Job, Worker, Queue, Outbox Pattern, Sandbox.

## Tech Stack
| Layer | Cong nghe |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS v3 + Zustand |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Cache/Queue | Redis + BullMQ (chua tich hop) |
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
│   └── design/               # File design goc
├── packages/
│   ├── client/               # Frontend React
│   │   ├── src/
│   │   │   ├── components/   # React components
│   │   │   │   ├── layout/   # PromoBar, Navbar, Footer
│   │   │   │   ├── home/     # Hero, PaletteStrip, Categories, Lookbook, Manifesto, Perks
│   │   │   │   ├── shop/     # ProductGrid, ProductCard, Filters
│   │   │   │   ├── cart/     # CartDrawer
│   │   │   │   ├── product/  # ProductDetail, SizeSelector
│   │   │   │   ├── search/   # SearchModal
│   │   │   │   ├── ui/       # Modal, Toast, RuleButton
│   │   │   │   └── svg/      # GarmentSVG, EditorialSVG
│   │   │   ├── store/        # Zustand stores (cart, product, ui)
│   │   │   ├── data/         # Fallback products, section rules
│   │   │   └── utils/        # Format helpers
│   │   └── ...config files
│   └── server/               # Backend Express
│       ├── src/
│       │   ├── config/       # DB, Redis, env config
│       │   ├── models/       # Product, Cart, Order, Outbox
│       │   ├── controllers/  # CRUD logic
│       │   ├── routes/       # API routes
│       │   └── middleware/   # Error handler
│       └── seed/             # Seed 8 san pham
```

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

## Tinh nang da hoan thanh (Giai doan 1)
- [x] Landing page day du theo design FORM. Seoul Earth V3
- [x] SVG garment illustrations (tee, polo, shirt, jeans, hoodie, cardigan, bag)
- [x] SVG editorial illustrations (hero, lookbook)
- [x] Product grid voi filter va sort
- [x] Product detail modal
- [x] Cart drawer (localStorage)
- [x] Search modal
- [x] Nut Quy tac (RuleButton) tren moi section
- [x] Backend REST API (Products, Cart, Orders)
- [x] Outbox model (san sang cho giai doan sau)
- [x] Seed data 8 san pham
- [x] Docker Compose (MongoDB + Redis)
- [x] Responsive mobile/desktop

## Giai doan tiep theo
- [ ] Giai doan 2: Queue & Worker (BullMQ, Order Worker, Email Worker)
- [ ] Giai doan 3: Cron Job & Outbox (Nhac gio hang bo quen, Bao cao ngay)
- [ ] Giai doan 4: Sandbox & Infra (Docker profiles, Sandbox mode)
- [ ] Giai doan 5: Admin Dashboard (Chuyen tu Electron sang Web)

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

# Truy cap: http://localhost:5173
```

