# TMF — Code Rules

> Quy tac code cho toan bo project. Moi task moi PHAI tuan thu cac rule nay.

## 1. Cau truc project
- Monorepo voi npm workspaces: `packages/client`, `packages/server`
- KHONG tao file/folder ngoai cau truc da dinh
- Moi component React nam trong thu muc tuong ung: layout/, home/, shop/, cart/, product/, search/, ui/, svg/
- Backend theo pattern: routes → controllers → models

## 2. Naming conventions
### Files & Folders
- Component React: **PascalCase** (VD: `ProductCard.jsx`, `GarmentSVG.jsx`)
- Store Zustand: **camelCase** + hau to `Store` (VD: `cartStore.js`, `productStore.js`)
- Backend models: **PascalCase** (VD: `Product.js`, `Cart.js`)
- Backend routes/controllers: **camelCase** + hau to tuong ung (VD: `productRoutes.js`, `cartController.js`)
- Utils/helpers: **camelCase** (VD: `format.js`)
- Data files: **camelCase** (VD: `products.js`, `rules.js`)

### Variables & Functions
- Bien va ham: **camelCase** (VD: `formatPrice`, `getProducts`)
- Component: **PascalCase** (VD: `ProductCard`, `Hero`)
- Constants: **UPPER_SNAKE_CASE** (VD: `FALLBACK_PRODUCTS`, `SECTION_RULES`)
- API response: `{ success: true/false, data/message }`

## 3. Frontend rules
- Dung **Tailwind CSS** cho tat ca styling, KHONG dung CSS modules hay styled-components
- State management: **Zustand** — KHONG dung React Context hay Redux
- Color palette dung cac ten tu tailwind.config.js: `ink`, `accent`, `paper`, `muted`, `hero`, etc.
- SVG illustrations: dung component GarmentSVG va EditorialSVG, KHONG dung anh bitmap
- Moi section PHAI co **RuleButton** de mo ta quy tac
- Responsive: mobile-first, dung Tailwind responsive prefixes (md:, lg:)
- Product data lay tu store (fetch API hoac fallback)

## 4. Backend rules
- ES Modules (`import/export`), KHONG dung CommonJS (`require`)
- Tat ca route handlers dung `async/await` voi try/catch va `next(err)`
- Error handler middleware xu ly loi tap trung
- API prefix: `/api/` (VD: `/api/products`, `/api/cart`)
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

## 8. Quy tac 4 viec sau moi task
1. **Auto Push**: `git add . && git commit -m "mô tả tiếng Việt" && git push`
2. **Update SUMMARY.md**: Cap nhat tinh nang moi, thay doi cau truc
3. **Update RuleButton**: Cap nhat rules.js neu co section/logic moi
4. **Update CODE_RULES.md**: Bo sung rule moi neu can
