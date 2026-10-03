# S.t CMS API

Backend NestJS + TypeORM + PostgreSQL cho CMS nội bộ quản lý nội dung website S.t.

## Biến môi trường

Chỉ có **một** file `.env` cho toàn bộ monorepo, ở **thư mục gốc** (`../../.env.example` → `../../.env`), không có `.env` riêng trong `apps/api`. Xem `apps/api/src/config/root-env.ts` — `ConfigModule` và TypeORM CLI đều đọc từ đó.

## Cài đặt & chạy (Docker)

`docker-compose.yml` cũng nằm ở **thư mục gốc monorepo** (build context cần thấy `package-lock.json` chung của workspaces), không phải trong `apps/api`.

```bash
cd ../..                     # về thư mục gốc repo
cp .env.example .env         # điền JWT secrets + thông tin Cloudflare R2 thật
docker compose up -d --build
```

API chạy tại `http://localhost:3001`, Swagger docs tại `http://localhost:3001/docs`.
Container `api` tự chạy migration (`typeorm migration:run`) trước khi start.

## Seed tài khoản admin đầu tiên

```bash
npm install
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/st_cms" npm run seed
```

Mặc định: `admin@st-coffee.local` / `ChangeMe123!` (đổi qua `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` trong `.env`).

> Lưu ý: `docker-compose.yml` map Postgres ra cổng host `5433` (tránh đụng Postgres khác đang chạy sẵn trên máy). Bên trong mạng Docker, API vẫn kết nối qua `postgres:5432`.

## Phát triển local (không Docker)

```bash
npm install
npm run migration:run      # cần DATABASE_URL trỏ tới Postgres đang chạy
npm run start:dev
```

## Lệnh TypeORM

```bash
npm run migration:generate   # tạo migration mới từ thay đổi entity
npm run migration:run
npm run migration:revert
```

## Biến môi trường

Xem `.env.example`. Bắt buộc cấu hình Cloudflare R2 (`R2_*`) để tính năng upload ảnh/file hoạt động — nếu để placeholder, các API khác vẫn chạy bình thường, chỉ upload sẽ lỗi.
