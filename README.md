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
| `npm run reset-admin` | Khôi phục tài khoản Quản trị viên duy nhất: đặt mật khẩu mới (`ADMIN_NEW_PASSWORD`, mặc định sinh ngẫu nhiên và in ra), mở khoá, kích hoạt lại, đăng xuất mọi phiên; tạo lại nếu tài khoản đã mất |
| `npm run seed:demo` | Nạp dữ liệu demo đầy đủ (sản phẩm, bài viết, tuyển dụng, câu chuyện, đội ngũ, trang chủ, liên hệ, trang Nội bộ…). Idempotent — chạy lại chỉ cập nhật. Nội dung ở `apps/api/src/database/seed-data.ts` |
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

Website là static export; mọi dữ liệu lấy lúc chạy từ các endpoint `/public/*` (đã lọc sẵn phía server: chỉ sản phẩm đang bán, bài đã xuất bản, tin tuyển dụng đang mở; bài `INTERNAL_UPDATE` không bao giờ lộ ra). Mục nào chưa có dữ liệu thì **tự ẩn** (kể cả mục trên menu) — không có nội dung giả.

| Trang công khai | Nguồn dữ liệu trong CMS |
|---|---|
| `/` Trang chủ | Tab **Trang chủ** (banner, giới thiệu, không gian, bật/tắt từng mục) + dữ liệu các tab khác |
| `/story/` Câu Chuyện S+ | **Câu chuyện S+** (Hướng đi, Văn hoá, đội ngũ cốt lõi/cố vấn) |
| `/products/`, `/products/detail/?id=` | **Sản phẩm** (lọc Đồ uống: Nóng/Đá/Tươi; Vật phẩm: sổ tay/bút/bình/túi) |
| `/news/`, `/news/post/?slug=` | **Tin tức** (Thông báo, Coming Soon, Sản phẩm mới, Bài viết) |
| `/jobs/`, `/jobs/detail/?id=` | **Tuyển dụng** |
| `/internal/…` **Nội bộ** (cần đăng nhập, menu dropdown) | **Thông Báo** (mục lục + nút "Chi Tiết" trỏ tới link cấu hình trong CMS) và **Con người phù hợp** (trang tĩnh, nội dung cấu hình trong CMS). "Quy chuẩn chuyên môn" tạm ẩn |
| Chân trang (mọi trang) | **Thông tin liên hệ** (SĐT, giờ mở cửa, lời cảm ơn, Facebook/Instagram/YouTube/TikTok/chat) |

Trang chi tiết dùng query string (`?id=`, `?slug=`) vì static export không có route động.

**Menu**: Trang chủ · Câu Chuyện S+ · Sản Phẩm · Tin Tức - Sự Kiện · Tuyển Dụng · Nội bộ. Các mục nội dung tự ẩn khi CMS chưa có dữ liệu; **Nội bộ** luôn hiện và yêu cầu đăng nhập. Sau khi đăng nhập, nút "Đăng Nhập" ở thanh trên đổi thành **tên người dùng** (menu: Nội bộ, Quản trị CMS cho admin, Đăng xuất).

**Khu Nội bộ**: menu "Nội bộ" là dropdown gồm `/internal/notices/` (Thông Báo: tiêu đề, câu giới thiệu và từng dòng mục lục + link "Chi Tiết" đều cấu hình ở CMS → **Trang Nội bộ**) và `/internal/people/` (Con người phù hợp: tiêu đề, lời dẫn, nội dung rich-text; các tiêu đề tự thành mục lục). Dữ liệu lưu ở `site_settings` (khoá `internal-notices`, `internal-people`), đọc qua `GET /internal/notices|people` (mọi người đã đăng nhập), sửa qua `/admin/site-settings/internal-*` (Admin).

**Font** lấy từ thiết kế Canva (`components/site/display-font.ts`): Alatsi cho logo, menu và tiêu đề; Noto Serif Display cho đoạn văn; Roboto cho nút đăng nhập/tài khoản; Noto Sans đậm cho tiêu đề "Không Gian". Logo và menu in hoa. CMS giữ Be Vietnam Pro cho giao diện của riêng nó.

**Responsive**: cả website và CMS dùng được trên điện thoại (≥ 360px) và máy tính bảng. Website: menu ngang từ 1280px, dưới đó là menu bấm; lưới sản phẩm 2 cột trên điện thoại. CMS: thanh bên là ngăn kéo trên điện thoại và tự thu thành thanh biểu tượng trên máy tính bảng (bấm "Thu gọn/Mở rộng" để đổi, lựa chọn được nhớ); bảng dữ liệu ẩn bớt cột phụ trên màn hình nhỏ (`meta.hideBelow` của cột trong `DataTable`); lịch tháng chuyển sang dạng chấm + danh sách theo ngày trên điện thoại.

Trang chủ cấu hình kiểu WP: mỗi mục (Banner, Giới thiệu ngắn, Không gian) có form riêng, công tắc ẩn/hiện và **preview render đúng component của trang chủ thật**. Mục "Sản phẩm mới" lấy dữ liệu từ tab Sản phẩm nên chỉ có công tắc bật/tắt. Trước lần lưu đầu tiên, trang chủ dùng nội dung mặc định ở `apps/api/src/modules/site-settings/home-settings.ts`.

Các mục trong `plan.md` ⇄ module CMS:

| plan.md | Module CMS |
|---|---|
| 1. Câu chuyện | Story (StoryBlock + TeamMember) |
| 2. Cửa hàng | _(đã bỏ khỏi website và CMS)_ |
| 3. Sản phẩm | Products |
| 4. Tin tức | Posts (ANNOUNCEMENT / COMING_SOON / NEW_PRODUCT / CULTURE_ARTICLE) |
| 5. Cho đi | _(đã bỏ khỏi website và CMS)_ |
| 6. Tuyển dụng | Jobs |
| 7. Nội bộ | Khu `/internal/` trên website (Admin **và** Nhân viên) ← site_settings (internal-notices, internal-people), quản lý ở CMS → Trang Nội bộ |

## Phân quyền (RBAC) — Admin & Nhân viên

Hai role, lưu ở `admins.role`, gắn vào JWT access token lúc đăng nhập (đổi role có hiệu lực tối đa sau `JWT_ACCESS_EXPIRES_IN`, vì refresh token luôn đọc lại role mới nhất từ DB):

- **Admin** — toàn quyền.
- **Nhân viên** — **chỉ xem** (read-only) và **không dùng CMS**. Sau đăng nhập, nhân viên vào thẳng khu **Nội bộ** trên website (`homeHrefForRole` trong `nav-items.ts`); mọi đường dẫn CMS đều được chuyển về đó.

Cơ chế chặn nằm ở `RolesGuard` (`common/guards/roles.guard.ts`): (1) mọi request ghi (`POST/PATCH/PUT/DELETE`) của Nhân viên bị từ chối `403` ở một chỗ duy nhất, không phụ thuộc từng controller; (2) route-level — decorator `@Roles(AdminRole.ADMIN)` chặn cả việc đọc, controller không gắn `@Roles` nghĩa là "mọi role đã đăng nhập" (đó là các endpoint khu Nội bộ đọc); (3) row-level riêng cho Posts — `PostsService.assertScope()` chỉ cho Nhân viên đọc bài `INTERNAL_UPDATE`. Quản lý tài khoản: trang **Tài khoản Admin** trong CMS, hoặc `PATCH /admin/admins/:id` (Admin-only).

## Lưu trữ file — Garage

[Garage](https://garagehq.deuxfleurs.fr) là object storage S3-compatible, self-host (AGPL-3.0). Cloudflare R2 chỉ dùng để backup.

- Service `garage` trong compose, cấu hình `infra/garage/garage.toml` (dev) / `garage.prod.toml` (prod) — copy từ `.example` và điền secret thật (`openssl rand -base64 32`); 2 file thật đã gitignore.
- Luồng upload: CMS gửi file (multipart) tới `POST /admin/media/upload` → API ghi vào Garage qua mạng nội bộ Docker và lưu record. Đọc file công khai qua `GET /public/media/:key` (API stream từ Garage, cache 1 năm). Garage **không** mở port ra ngoài, không cần CORS hay domain riêng.
- `GARAGE_PUBLIC_BASE_URL` là URL gốc lưu vào `Media.url`, trỏ tới route media của chính API, ví dụ `http://<host>:3001/public/media`.
- Giới hạn upload: `MAX_UPLOAD_SIZE_BYTES` (mặc định 15 MB) kiểm tra ở `MediaService.upload()`; file được giữ trong RAM của API trong lúc ghi nên đừng đặt giới hạn quá lớn.

## Backup tự động → Cloudflare R2

Cron nội bộ, `BACKUP_CRON` (mặc định `0 3 * * *`):

- `pg_dump` toàn bộ DB → gzip → stream thẳng lên R2.
- Toàn bộ object trong bucket Garage → copy stream sang R2 (4 luồng song song, không tải hết vào RAM).
- Giữ `BACKUP_RETENTION_COUNT` bản mới nhất (mặc định 3), tự xoá bản cũ.

Ghi vào `backups/<timestamp>/db.sql.gz` và `backups/<timestamp>/media/...` trên bucket `R2_BACKUP_BUCKET_NAME`. Endpoint Admin-only: `GET /admin/backups` (liệt kê), `POST /admin/backups/run` (chạy ngay; 409 nếu đang chạy). Backup **không** gồm `.env` và `infra/garage/*.toml` — hãy lưu các secret này riêng. Image API cần `postgresql16-client` (đã có trong `Dockerfile`) để `pg_dump` khớp `postgres:16`.

## Request log & Rate limiting

- **Request log**: mọi request (trừ `OPTIONS`) ghi vào `request_logs` (method, path, query, status, thời gian xử lý, IP, user-agent, referer, admin + role, content-length) — fire-and-forget sau khi response đã trả, không làm chậm request. Tự dọn log cũ hơn `REQUEST_LOG_RETENTION_DAYS` (mặc định 30) lúc 4h sáng. Xem `GET /admin/request-logs` (Admin-only; lọc `path`/`isError`/`adminId`).
- **Rate limit**: `@nestjs/throttler`, `RATE_LIMIT_MAX` request / `RATE_LIMIT_TTL_SECONDS` giây (120/60s) theo IP; chặt hơn riêng cho `/auth/login` (10/phút) và `/admin/media/upload` (30/phút).

## Deploy production (GitHub Actions → VPS)

`.github/workflows/deploy.yml`: push lên `main` → build 2 image (`api`, `web`) → push lên GHCR → gửi `docker-compose.prod.yml`, `.env`, `infra/garage/*` lên VPS qua SSH/SCP → `docker compose pull` + `up -d` (Postgres, Garage, api, web) → bật website công khai cho bucket Garage. VPS **không cần clone repo** và không build gì; lần đầu workflow tự cài Docker và đăng nhập GHCR bằng token của chính lần chạy đó.

### Thiết lập một lần

1. **Secrets** (GitHub → Settings → Secrets and variables → Actions):
   - `VPS_HOST`, `VPS_USER` (vd. `ubuntu` trên EC2, cần `sudo` không mật khẩu), `VPS_SSH_KEY` (private key đầy đủ), `VPS_PORT` (bỏ qua nếu 22), `VPS_DEPLOY_PATH` (đường dẫn tuyệt đối, vd. `/opt/ecommerce`; workflow tự tạo).
   - `ENV_FILE` (tuỳ chọn): **toàn bộ nội dung** file `.env` production. Có secret này thì mỗi lần deploy ghi đè `.env` trên VPS.
   - `GARAGE_PROD_TOML` (tuỳ chọn): **toàn bộ nội dung** `infra/garage/garage.prod.toml`, tương tự.
   - Nếu để trống và VPS chưa có file, workflow tự copy từ `.env.example` / `garage.prod.toml.example` và **sinh sẵn** JWT secrets, key Garage, rpc/admin token. Các giá trị khác (CORS_ORIGIN, R2_*, SEED_ADMIN_*, domain Garage) vẫn là giá trị mẫu — nên đặt secret thật hoặc sửa file trên VPS. File đã có trên VPS không bị ghi đè.
   - Đặt từ file: `gh secret set ENV_FILE < .env` (PowerShell: `Get-Content .env -Raw | gh secret set ENV_FILE`).
2. **Variables**: `NEXT_PUBLIC_API_BASE_URL` — URL public của API (vd. `https://api.yourdomain.com`), build cứng vào `web`.
3. Security Group / firewall của VPS: mở 22, 80 và 3001 (API). Không cần mở 3900/3902 (Garage chỉ dùng nội bộ).
4. Tạo admin đầu tiên (một lần, chạy từ máy có `DATABASE_URL` trỏ tới DB production): `npm run seed`.

### Khôi phục tài khoản Quản trị viên

Hệ thống chỉ có **một** tài khoản Quản trị viên (tạo bằng `seed`); mọi tài khoản tạo thêm trong CMS đều là Nhân viên. Khi quên mật khẩu hoặc mất tài khoản này, chạy trên VPS (không cần đăng nhập CMS):

```bash
cd /opt/ecommerce   # VPS_DEPLOY_PATH
docker compose -f docker-compose.prod.yml exec -e ADMIN_NEW_PASSWORD='MatKhauMoi!123' api node dist/database/reset-admin.js
# bỏ -e ... để hệ thống tự sinh mật khẩu ngẫu nhiên và in ra màn hình
```

### Nạp dữ liệu demo lên production

Chạy **sau** khi `api` đã khởi động (migration chạy tự động lúc khởi động). Dữ liệu là nội dung giả lập (tên, địa chỉ, SĐT đều là demo) — sửa trong CMS hoặc trong `seed-data.ts` trước khi công khai:

```bash
cd /opt/ecommerce   # VPS_DEPLOY_PATH
docker compose -f docker-compose.prod.yml exec api node dist/database/seed-demo.js
# tài khoản admin đầu tiên (nếu chưa có):
docker compose -f docker-compose.prod.yml exec api node dist/database/seed.js
```

Ảnh demo là SVG minh hoạ nằm ở `apps/web/public/images/seed/` (đi cùng image `web`), thay bằng ảnh thật qua CMS khi có.
