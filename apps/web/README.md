# S.t Web — Landing page + Admin Dashboard

Next.js (App Router, static export) + shadcn/ui. Gọi API tại `apps/api`.

- `/` — landing page công khai, giới thiệu S.t (tĩnh, không gọi API).
- `/admin` — CMS quản trị nội dung (yêu cầu đăng nhập).

## Phát triển local

Không có `.env.local` riêng — biến môi trường (`NEXT_PUBLIC_API_BASE_URL`...) nằm trong `.env` ở **thư mục gốc monorepo** (`cp ../../.env.example ../../.env`), được nạp qua `next.config.ts`.

```bash
npm install
npm run dev
```

## Build production (static export)

```bash
npm run build
```

Kết quả nằm ở `out/` — đây là file tĩnh thuần tuý, deploy lên bất kỳ static host nào (Nginx, Cloudflare Pages, S3+CDN...). Không cần Node server lúc chạy, không cần Docker.

```bash
npx serve out    # xem thử bản build production
```

## Lưu ý kiến trúc

- Toàn bộ xác thực/dữ liệu fetch client-side (static export không hỗ trợ middleware/server actions). Bảo vệ route qua `src/app/admin/dashboard/layout.tsx` (client component kiểm tra token trong `localStorage`).
- Trang sửa (`.../form/?id=...`) dùng query string thay vì dynamic route `[id]`, vì static export không thể pre-render route động theo ID thực tế — đây là pattern "SPA on static export".
- `NEXT_PUBLIC_API_BASE_URL` được bake lúc build — mỗi môi trường deploy cần build riêng nếu API URL khác nhau.
- `.env` dùng chung với `apps/api`, đặt ở thư mục gốc monorepo (không phải trong `apps/web`) — xem `next.config.ts`.
