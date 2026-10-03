# S.t CMS

Monorepo (npm workspaces + Turborepo) cho website công khai và CMS nội bộ của chuỗi cà phê S.t (xem [plan.md](plan.md) cho yêu cầu nội dung gốc).

- `apps/api` — NestJS + TypeORM + PostgreSQL. Xem [apps/api/README.md](apps/api/README.md).
- `apps/web` — Next.js (static export) + shadcn/ui. Trang `/` là landing page công khai, `/admin` là dashboard quản trị. Xem [apps/web/README.md](apps/web/README.md).

## Biến môi trường

Chỉ **một** file `.env` duy nhất ở thư mục gốc cho cả `api` lẫn `web` (không có `.env` riêng trong từng `apps/*` nữa):

```bash
cp .env.example .env   # điền JWT secrets, Cloudflare R2, NEXT_PUBLIC_API_BASE_URL...
```

- `apps/api` đọc file này qua `ConfigModule` (xem `apps/api/src/config/root-env.ts`).
- `apps/web` đọc file này trong `next.config.ts` (biến `NEXT_PUBLIC_*` được build cứng vào static export lúc `next build`).

## Chạy nhanh toàn bộ hệ thống (Docker)

`docker-compose.yml` ở thư mục gốc dựng cả 3: Postgres, `api` (NestJS) và `web` (static export được nginx serve ở cổng 80 trong container, map ra `3000`).

```bash
docker compose up -d --build
npm install && DATABASE_URL="postgresql://postgres:postgres@localhost:5433/st_cms" npm run seed --workspace=api
```

Landing page tại `http://localhost:3000`, đăng nhập CMS tại `http://localhost:3000/admin` bằng tài khoản vừa seed. API tại `http://localhost:3001`.

> `NEXT_PUBLIC_API_BASE_URL` được build cứng vào static export của `web` — nếu `api` không chạy ở `localhost:3001` (vd. deploy thật), sửa giá trị này trong `.env` ở root rồi `docker compose up -d --build web`.

## Phát triển local (không Docker)

```bash
npm install
npm run dev     # turbo chạy song song api (watch) + web (next dev)
npm run build   # build cả 2 app
npm run lint    # lint cả 2 app
```

## 7 mục nội dung ⇄ module CMS

| Mục trong plan.md | Module CMS |
|---|---|
| 1. Câu chuyện | Story (StoryBlock + TeamMember) |
| 2. Cửa hàng | Stores |
| 3. Sản phẩm | Products |
| 4. Tin tức | Posts (type: ANNOUNCEMENT / COMING_SOON / NEW_PRODUCT / CULTURE_ARTICLE) |
| 5. Cho đi | Posts (type: GIVE_BACK) |
| 6. Tuyển dụng | Jobs |
| 7. Nội bộ | Đăng nhập CMS (Admin) + Documents + InternalAnnouncements + ScheduleEntries + Posts (type: INTERNAL_UPDATE) |
