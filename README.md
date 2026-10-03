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

## Deploy production (GitHub Actions → VPS)

`.github/workflows/deploy.yml`: push lên `main` → build 2 image (`api`, `web`) → push lên GitHub Container Registry (GHCR) → SSH vào VPS, `git pull` + `docker compose -f docker-compose.prod.yml pull && up -d`. VPS **không build** gì cả — chỉ pull image có sẵn, nên không cần nhiều CPU/RAM.

`docker-compose.prod.yml` dùng image từ GHCR thay vì build từ source (khác với `docker-compose.yml` dùng cho dev local).

### Thiết lập 1 lần

1. **Secrets** ở GitHub repo → Settings → Secrets and variables → Actions → **Secrets**:
   - `VPS_HOST` — IP/domain VPS
   - `VPS_USER` — user SSH dùng để deploy
   - `VPS_SSH_KEY` — **private key** (xem bên dưới)
   - `VPS_PORT` — SSH port (bỏ qua nếu dùng port 22 mặc định)
   - `VPS_DEPLOY_PATH` — thư mục đã clone repo trên VPS (vd. `/opt/ecommerce`)
2. **Variables** (không bí mật) → tab **Variables** cùng chỗ trên:
   - `NEXT_PUBLIC_API_BASE_URL` — URL public của API (vd. `https://api.yourdomain.com`), bake cứng vào `web` lúc build.
3. Trên VPS: cài Docker + Docker Compose plugin, sau đó:
   ```bash
   git clone https://github.com/tuanthanh1011/ecommerce.git /opt/ecommerce
   cd /opt/ecommerce
   cp .env.example .env   # điền JWT secrets, Cloudflare R2 thật
   mkdir -p ~/.ssh && echo "<public key>" >> ~/.ssh/authorized_keys
   ```
4. Sau lần đầu Actions chạy, image trên GHCR mặc định ở chế độ **private** — vào GitHub → tab **Packages** của repo → từng package (`ecommerce-api`, `ecommerce-web`) → Package settings → **Change visibility → Public**, để VPS `pull` được mà không cần đăng nhập registry. (Hoặc giữ private và `docker login ghcr.io` một lần trên VPS bằng Personal Access Token có quyền `read:packages`.)

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
