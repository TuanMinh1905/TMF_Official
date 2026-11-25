# TMF Official — Agent Rules

## Du an
TMF (TuanMinh Fashion) — Website thuong mai dien tu thoi trang unisex phong cach Seoul Earth.
Monorepo voi npm workspaces: `packages/client` (React) va `packages/server` (Express).

## Sau moi task quan trong, thuc hien 4 viec:

### 1. Auto Push GitHub
- Commit message bang tieng Viet, KHONG icon/emoji
- Quy trinh: `git add .` → `git commit -m "mo ta tieng Viet"` → `git push`
- Vi du dung: `Hoan thanh giao dien trang chu`
- Vi du sai: `🎨 feat: homepage` ← KHONG lam the nay

### 2. Update Summary
- File: `docs/SUMMARY.md`
- Mo ta tong quan he thong, module da hoan thanh, tech stack
- Muc dich: conversation khac doc file nay se hieu ro he thong

### 3. Nut Quy tac tren Web
- Component `RuleButton` tren moi Section/Tab
- Click hien modal giai thich: muc dich, cach su dung, du lieu
- Hien thi tren giao dien web, KHONG phai file rieng
- Cap nhat khi co thay doi logic/chuc nang

### 4. Update Code Rules
- File: `docs/CODE_RULES.md`
- Quy tac dat ten, code style, convention
- Muc dich: task sau tuan thu, khong lam loan he thong

## Quy tac code

### Frontend
- React 18 + Vite + Tailwind CSS + Zustand
- Component: PascalCase (VD: `ProductCard.jsx`)
- Store: camelCase + hau to Store (VD: `cartStore.js`)
- Dung Tailwind classes, KHONG CSS modules
- Color palette: `ink`, `accent`, `paper`, `muted`, `hero` (xem `tailwind.config.js`)

### Backend
- Node.js + Express + Mongoose, ES Modules (`import/export`)
- Model: PascalCase (VD: `Product.js`)
- Route/Controller: camelCase (VD: `productRoutes.js`)
- API prefix: `/api/`
- Response format: `{ success: true/false, data/message }`

### Database
- MongoDB + Redis chay qua Docker Compose
- dotenv config load tu `../../.env`

