# TMF — Code Rules

> Quy tac code cho toan bo project. Moi task moi PHAI tuan thu cac rule nay.

## 1. Cau truc project
- Monorepo voi npm workspaces: `packages/client`, `packages/server`
- KHONG tao file/folder ngoai cau truc da dinh
- Moi component React nam trong thu muc tuong ung: layout/, home/, shop/, cart/, product/, search/, ui/, svg/, admin/
- Backend theo pattern: routes → controllers → models

## 2. Naming conventions
### Files & Folders
- Component React: **PascalCase** (VD: `ProductCard.jsx`, `GarmentSVG.jsx`, `AdminNav.jsx`)
- Store Zustand: **camelCase** + hau to `Store` (VD: `cartStore.js`, `adminStore.js`)
- Backend models: **PascalCase** (VD: `Product.js`, `Cart.js`)
- Backend routes/controllers: **camelCase** + hau to tuong ung (VD: `productRoutes.js`, `statsController.js`)
- Cron jobs: **camelCase** + hau to `Cron` (VD: `abandonedCartCron.js`, `dailyReportCron.js`)
- Ngoai le: `outboxProcessor.js` (processor, khong phai cron thuan tuy)
- Utils/helpers: **camelCase** (VD: `format.js`)
- Data files: **camelCase** (VD: `products.js`, `rules.js`)
- Config files: **camelCase** (VD: `sandbox.js`, `shutdown.js`)
- Middleware: **camelCase** (VD: `rateLimiter.js`, `requestLogger.js`)

### Variables & Functions
- Bien va ham: **camelCase** (VD: `formatPrice`, `getProducts`, `fetchStats`)
- Component: **PascalCase** (VD: `ProductCard`, `StatCard`, `SystemPanel`)
- Constants: **UPPER_SNAKE_CASE** (VD: `FALLBACK_PRODUCTS`, `SECTION_RULES`)
- API response: `{ success: true/false, data/message }`

## 3. Frontend rules
- Dev server chay tai port mac dinh `3000` (cau hinh trong `packages/client/vite.config.js`)
- Dung **Tailwind CSS** cho tat ca styling, KHONG dung CSS modules hay styled-components
- State management: **Zustand** — KHONG dung React Context hay Redux
- Color palette dung cac ten tu tailwind.config.js: `ink`, `accent`, `paper`, `muted`, `hero`, etc.
- SVG illustrations: dung component GarmentSVG va EditorialSVG, KHONG dung anh bitmap
- Moi section PHAI co **RuleButton** de mo ta quy tac
- Responsive: mobile-first, dung Tailwind responsive prefixes (md:, lg:)
- Product data lay tu store (fetch API hoac fallback)
- Admin components dat trong `components/admin/`

## 4. Backend rules
- ES Modules (`import/export`), KHONG dung CommonJS (`require`)
- Tat ca route handlers dung `async/await` voi try/catch va `next(err)`
- Error handler middleware xu ly loi tap trung
- API prefix: `/api/` (VD: `/api/products`, `/api/cart`, `/api/stats/dashboard`)
- dotenv config load tu file `../../.env` (tuong doi tu packages/server/)
- Mongoose models export default

## 5. Git rules
- Commit message bang **tieng Viet**, KHONG emoji/icon
- Vi du tot: "Hoan thanh giao dien trang chu"
- Vi du xau: "🎨 feat: homepage UI" ← KHONG lam the nay
- Push len branch `main`
- Sau moi task quan trong: push + update SUMMARY.md + update CODE_RULES.md

## 6. Data rules
- Seed data trong `packages/server/seed/products.js`
- Frontend fallback data trong `packages/client/src/data/products.js`
- Section rules trong `packages/client/src/data/rules.js`
- Khi them san pham moi: cap nhat CA seed data va fallback data

## 7. Docker rules
- MongoDB va Redis chay qua Docker Compose
- KHONG cai MongoDB/Redis truc tiep tren may
- Dung volume `mongo-data` de persist data
- Port mac dinh: MongoDB 27017, Redis 6379
- Dev profile: Mongo Express (8081), Redis Commander (8082)
- Chay dev tools: `npm run docker:dev`

## 8. Queue & Worker rules
- Dung **BullMQ** + **IORedis** cho queue system
- Queue files dat trong `src/queues/`, Worker files dat trong `src/workers/`
- Naming: queue file = `<ten>Queue.js` (camelCase), worker file = `<ten>Worker.js` (camelCase)
- Redis connection dung chung tu `config/redis.js`, KHONG tao connection moi trong moi file
- Worker import trong `index.js` de chay cung process voi API server
- Job options mac dinh: `attempts: 3`, `backoff: exponential`, `removeOnComplete: 100`
- Khi day job vao queue, PHAI try/catch de API khong crash neu Redis down
- Order Worker: concurrency 1 (dam bao thu tu FIFO)
- Email Worker: concurrency 3 (email gui song song duoc)
- Report Worker: concurrency 1 (bao cao chay tuan tu)

## 9. Cron Job rules
- Cron files dat trong `src/crons/`
- Dung `setInterval` cho demo (production se dung cron library)
- Moi cron export ham `start<Ten>()` tra ve interval ID va `get<Ten>Status()` tra ve trang thai
- Cron duoc khoi dong trong `index.js` sau khi DB ket noi
- Interval IDs truyen vao `setupGracefulShutdown()` de cleanup
- Dung co `isScanning`/`isChecking` de tranh overlap giua cac lan chay
- Log prefix: `[Ten Cron]` (VD: `[Outbox Processor]`, `[Abandoned Cart]`, `[Daily Report]`)

## 10. Middleware rules
- Middleware files dat trong `src/middleware/`
- Rate limiter: in-memory Map, mac dinh 100 req/phut/IP
- Request logger: chi chay o NODE_ENV=development
- Sandbox middleware: check SANDBOX_MODE env, chan POST/PUT/DELETE

## 11. Infra rules
- Graceful shutdown: xu ly SIGINT + SIGTERM, dong cron → HTTP → Redis → MongoDB
- Sandbox mode: bat/tat qua bien moi truong SANDBOX_MODE=true/false
- .env.example luon cap nhat khi them bien moi truong moi

## 12. Quy tac 4 viec sau moi task
1. **Auto Push**: `git add . && git commit -m "mô tả tiếng Việt" && git push`
2. **Update SUMMARY.md**: Cap nhat tinh nang moi, thay doi cau truc
3. **Update RuleButton**: Cap nhat rules.js neu co section/logic moi
4. **Update CODE_RULES.md**: Bo sung rule moi neu can
