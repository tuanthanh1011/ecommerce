# S+ CMS

Website công khai và CMS nội bộ của chuỗi cà phê S+. Monorepo npm workspaces + Turborepo; yêu cầu nội dung gốc ở [plan.md](plan.md).

| Thư mục | Vai trò |
|---|---|
| `apps/api` | NestJS + TypeORM + PostgreSQL. REST API, Swagger tại `/docs`. |
| `apps/web` | Next.js (static export) + shadcn/ui. Website công khai ở `/…`, CMS ở `/admin`. |
| `infra/garage` | Cấu hình Garage (object storage S3-compatible, self-host). |

**Mọi lệnh đều chạy từ thư mục gốc.** Không có README, `.env` hay script nào riêng trong `apps/*`.

## Lệnh (chạy ở thư mục gốc)

| Lệnh | Việc làm |
|---|---|
| `npm install` | Cài dependency cho cả 2 app |
| `npm run dev` | Chạy song song `api` (watch, cổng 3001) và `web` (`next dev`, cổng 3000) |
| `npm run build` | Build cả 2 app (`web` ra `apps/web/out/`) |
| `npm run lint` | Lint cả 2 app (`api` tự sửa lỗi format) |
| `npm run migration:run` | Chạy các migration đang chờ |
| `npm run migration:generate -- Ten` | Sinh migration mới từ thay đổi entity |
| `npm run migration:revert` | Hoàn tác migration gần nhất |
| `npm run seed` | Tạo tài khoản admin đầu tiên (idempotent) |
| `npm run garage:setup` | Bật chế độ "website" công khai cho bucket Garage (chạy 1 lần sau lần `docker compose up` đầu tiên) |

## Biến môi trường

Chỉ **một** file `.env` ở thư mục gốc cho cả `api` lẫn `web`:

```bash
cp .env.example .env
```

Điền JWT secrets, Garage, Cloudflare R2 (backup) và `NEXT_PUBLIC_API_BASE_URL`. `api` đọc file này qua `ConfigModule` (`apps/api/src/config/root-env.ts`); `web` đọc trong `next.config.ts` — biến `NEXT_PUBLIC_*` được build cứng vào static export lúc `next build`. Mặc định admin seed: `admin@st-coffee.local` / `ChangeMe123!` (đổi qua `SEED_ADMIN_*`).

## Chạy local

Cần Docker cho Postgres và Garage:

```bash
cp .env.example .env
#   .env: đặt DATABASE_URL=postgresql://postgres:postgres@localhost:5433/st_cms
#         (hostname `postgres` trong .env.example chỉ đúng bên trong mạng Docker)
docker compose up -d postgres garage garage-webui
npm install
npm run garage:setup
npm run migration:run
npm run seed
npm run dev
```

- Website: `http://localhost:3000` · CMS: `http://localhost:3000/admin` · API: `http://localhost:3001` (Swagger `/docs`).
- `http://localhost:3909` là **Garage Web UI** (chỉ bind `127.0.0.1`, dev-only): xem bucket, key, duyệt/tải file. Không có trong `docker-compose.prod.yml`.
- Postgres map ra cổng host `5433` để không đụng Postgres khác trên máy.

### Chạy toàn bộ bằng Docker

`docker-compose.yml` dựng Postgres, Garage, `api` (tự chạy migration khi khởi động) và `web` (nginx, map ra cổng `3000`):

```bash
cp .env.example .env
docker compose up -d --build
npm run garage:setup
npm install && npm run seed   # với DATABASE_URL trỏ localhost:5433
```

> `NEXT_PUBLIC_API_BASE_URL` được build cứng vào `web`. Nếu `api` không chạy ở `localhost:3001`, sửa trong `.env` rồi `docker compose up -d --build web`.

## Website công khai ⇄ CMS

Website là static export; mọi dữ liệu lấy lúc chạy từ các endpoint `/public/*` (đã lọc sẵn phía server: chỉ sản phẩm đang bán, cửa hàng đang hoạt động, bài đã xuất bản, tin tuyển dụng đang mở; bài `INTERNAL_UPDATE` không bao giờ lộ ra). Mục nào chưa có dữ liệu thì **tự ẩn** (kể cả mục trên menu) — không có nội dung giả.

| Trang công khai | Nguồn dữ liệu trong CMS |
|---|---|
| `/` Trang chủ | Tab **Trang chủ** (banner, giới thiệu, không gian, bật/tắt từng mục) + dữ liệu các tab khác |
| `/story/` Câu Chuyện S+ | **Câu chuyện S+** (Hướng đi, Văn hoá, đội ngũ cốt lõi/cố vấn) |
| `/stores/`, `/stores/detail/?id=` | **Cửa hàng** |
| `/products/`, `/products/detail/?id=` | **Sản phẩm** (lọc Đồ uống: Nóng/Đá/Tươi; Vật phẩm: sổ tay/bút/bình/túi) |
| `/news/`, `/news/post/?slug=` | **Tin tức** (Thông báo, Coming Soon, Sản phẩm mới, Bài viết) |
| `/give-back/`, `/give-back/post/?slug=` | **Tin tức** loại "Cho đi" |
| `/jobs/`, `/jobs/detail/?id=` | **Tuyển dụng** |
| Chân trang (mọi trang) | **Thông tin liên hệ** (SĐT, giờ mở cửa, lời cảm ơn, Facebook/Instagram/chat) |

Trang chi tiết dùng query string (`?id=`, `?slug=`) vì static export không có route động.

**Responsive**: cả website và CMS dùng được trên điện thoại (≥ 360px) và máy tính bảng. Website: menu ngang từ 1280px, dưới đó là menu bấm; lưới sản phẩm 2 cột trên điện thoại. CMS: thanh bên là ngăn kéo trên điện thoại và tự thu thành thanh biểu tượng trên máy tính bảng (bấm "Thu gọn/Mở rộng" để đổi, lựa chọn được nhớ); bảng dữ liệu ẩn bớt cột phụ trên màn hình nhỏ (`meta.hideBelow` của cột trong `DataTable`); lịch tháng chuyển sang dạng chấm + danh sách theo ngày trên điện thoại.

Trang chủ cấu hình kiểu WP: mỗi mục (Banner, Giới thiệu ngắn, Không gian) có form riêng, công tắc ẩn/hiện và **preview render đúng component của trang chủ thật**. Các mục lấy dữ liệu từ tab khác (Sản phẩm mới, Cửa hàng, Tin tức, Cho đi, Tuyển dụng) chỉ có công tắc bật/tắt. Trước lần lưu đầu tiên, trang chủ dùng nội dung mặc định ở `apps/api/src/modules/site-settings/home-settings.ts`.

Các mục trong `plan.md` ⇄ module CMS:

| plan.md | Module CMS |
|---|---|
| 1. Câu chuyện | Story (StoryBlock + TeamMember) |
| 2. Cửa hàng | Stores |
| 3. Sản phẩm | Products |
| 4. Tin tức | Posts (ANNOUNCEMENT / COMING_SOON / NEW_PRODUCT / CULTURE_ARTICLE) |
| 5. Cho đi | Posts (GIVE_BACK) |
| 6. Tuyển dụng | Jobs |
| 7. Nội bộ | Đăng nhập CMS (Admin **và** Nhân viên) + Documents + InternalAnnouncements + ScheduleEntries + Posts (INTERNAL_UPDATE) |

## Phân quyền (RBAC) — Admin & Nhân viên

Hai role, lưu ở `admins.role`, gắn vào JWT access token lúc đăng nhập (đổi role có hiệu lực tối đa sau `JWT_ACCESS_EXPIRES_IN`, vì refresh token luôn đọc lại role mới nhất từ DB):

- **Admin** — toàn quyền.
- **Nhân viên** — **chỉ xem** (read-only), và chỉ ở các mục "Nội bộ": Tài liệu & vận hành, Thông báo nội bộ, Lịch trình (và bài `INTERNAL_UPDATE`). Không thêm/sửa/xoá được gì; các mục còn lại của CMS bị chặn cả đọc. Nhân viên **không có Dashboard**: sau đăng nhập vào thẳng "Tài liệu & vận hành" (`homeHrefForRole` trong `nav-items.ts`), và mọi đường dẫn ngoài quyền đều được chuyển về đó.

Cơ chế chặn nằm ở `RolesGuard` (`common/guards/roles.guard.ts`): (1) mọi request ghi (`POST/PATCH/PUT/DELETE`) của Nhân viên bị từ chối `403` ở một chỗ duy nhất, không phụ thuộc từng controller; (2) route-level — decorator `@Roles(AdminRole.ADMIN)` chặn cả việc đọc, controller không gắn `@Roles` nghĩa là "mọi role đã đăng nhập"; (3) row-level riêng cho Posts — `PostsService.assertScope()` chỉ cho Nhân viên đọc bài `INTERNAL_UPDATE`. Trên CMS, Nhân viên không thấy nút Thêm/Sửa/Xoá; mở một bản ghi sẽ ra trang chi tiết chỉ xem thay vì form. Quản lý tài khoản: trang **Tài khoản Admin** trong CMS, hoặc `PATCH /admin/admins/:id` (Admin-only).

## Lưu trữ file — Garage

[Garage](https://garagehq.deuxfleurs.fr) là object storage S3-compatible, self-host (AGPL-3.0). Cloudflare R2 chỉ dùng để backup.

- Service `garage` trong compose, cấu hình `infra/garage/garage.toml` (dev) / `garage.prod.toml` (prod) — copy từ `.example` và điền secret thật (`openssl rand -base64 32`); 2 file thật đã gitignore.
- Luồng upload: CMS xin presigned PUT URL (`POST /admin/media/presign`) → trình duyệt PUT thẳng lên Garage → ghi record (`POST /admin/media`). API không stream file nào.
- `StorageService` dùng **2 S3Client** (cố ý): 1 trỏ endpoint nội bộ Docker (xoá file), 1 trỏ endpoint public (ký presigned URL — chữ ký SigV4 gồm cả Host header nên phải ký đúng host mà trình duyệt gọi).
- Giới hạn upload: `MAX_UPLOAD_SIZE_BYTES` (mặc định 15 MB) kiểm tra ở `MediaService.presign()` — lớp chặn thật sự duy nhất, vì presigned PUT không tự ràng buộc kích thước body. Production nên đặt reverse proxy trước cổng S3 (3900) với giới hạn body.
- Production cần domain + TLS thật trỏ vào Garage (S3 API và website endpoint) — xem comment trong `garage.prod.toml.example`.

## Backup tự động → Cloudflare R2

Cron nội bộ, `BACKUP_CRON` (mặc định `0 3 * * *`):

- `pg_dump` toàn bộ DB → gzip → stream thẳng lên R2.
- Toàn bộ object trong bucket Garage → copy stream sang R2 (4 luồng song song, không tải hết vào RAM).
- Giữ `BACKUP_RETENTION_COUNT` bản mới nhất (mặc định 3), tự xoá bản cũ.

Ghi vào `backups/<timestamp>/db.sql.gz` và `backups/<timestamp>/media/...` trên bucket `R2_BACKUP_BUCKET_NAME`. Endpoint Admin-only: `GET /admin/backups` (liệt kê), `POST /admin/backups/run` (chạy ngay; 409 nếu đang chạy). Backup **không** gồm `.env` và `infra/garage/*.toml` — hãy lưu các secret này riêng. Image API cần `postgresql16-client` (đã có trong `Dockerfile`) để `pg_dump` khớp `postgres:16`.

## Request log & Rate limiting

- **Request log**: mọi request (trừ `OPTIONS`) ghi vào `request_logs` (method, path, query, status, thời gian xử lý, IP, user-agent, referer, admin + role, content-length) — fire-and-forget sau khi response đã trả, không làm chậm request. Tự dọn log cũ hơn `REQUEST_LOG_RETENTION_DAYS` (mặc định 30) lúc 4h sáng. Xem `GET /admin/request-logs` (Admin-only; lọc `path`/`isError`/`adminId`).
- **Rate limit**: `@nestjs/throttler`, `RATE_LIMIT_MAX` request / `RATE_LIMIT_TTL_SECONDS` giây (120/60s) theo IP; chặt hơn riêng cho `/auth/login` (10/phút) và `/admin/media/presign` (30/phút).

## Deploy production (GitHub Actions → VPS)

`.github/workflows/deploy.yml`: push lên `main` → build 2 image (`api`, `web`) → push lên GHCR → SSH vào VPS, `git pull` + `docker compose -f docker-compose.prod.yml pull && up -d`. VPS không build gì, chỉ pull image.

### Thiết lập một lần

1. **Secrets** (GitHub → Settings → Secrets and variables → Actions): `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (private key), `VPS_PORT` (bỏ qua nếu 22), `VPS_DEPLOY_PATH` (thư mục clone repo, vd. `/opt/ecommerce`).
2. **Variables**: `NEXT_PUBLIC_API_BASE_URL` — URL public của API (vd. `https://api.yourdomain.com`), build cứng vào `web`.
3. Trên VPS (đã cài Docker + Compose plugin):
   ```bash
   git clone https://github.com/tuanthanh1011/ecommerce.git /opt/ecommerce
   cd /opt/ecommerce
   cp .env.example .env                                                     # điền secret thật
   cp infra/garage/garage.prod.toml.example infra/garage/garage.prod.toml   # điền secret + domain thật
   echo "<public key>" >> ~/.ssh/authorized_keys
   ```
   Sau lần `docker compose -f docker-compose.prod.yml up -d` đầu tiên, chạy `npm run garage:setup` (hoặc `sh infra/garage/setup.sh`) một lần.
4. Image trên GHCR mặc định **private**: đổi sang **Public** ở tab Packages (`ecommerce-api`, `ecommerce-web`), hoặc giữ private và `docker login ghcr.io` một lần trên VPS bằng PAT có quyền `read:packages`.
