#!/bin/sh
# Run this ONCE after the first `docker compose up -d` (dev or prod) — safe
# to re-run any time, it's idempotent. `--default-bucket` on the garage
# service already creates the bucket + key from GARAGE_ACCESS_KEY_ID/
# GARAGE_SECRET_ACCESS_KEY, but it does NOT turn on public website access,
# which is what makes uploaded files reachable by plain GET (see
# GARAGE_PUBLIC_BASE_URL / README "Garage" section). This script does that
# last step via `docker exec`, same as Garage's own docs recommend
# (https://garagehq.deuxfleurs.fr/documentation/cookbook/exposing-websites/).
set -eu

BUCKET="${1:-media}"
CONTAINER="$(docker compose ps -q garage)"

if [ -z "$CONTAINER" ]; then
  echo "garage container isn't running — start it first (docker compose up -d garage)" >&2
  exit 1
fi

echo "Enabling public website access on bucket '$BUCKET'..."
docker exec "$CONTAINER" /garage bucket website --allow --index-document index.html "$BUCKET"
echo "Done. Uploaded files are now served from GARAGE_PUBLIC_BASE_URL."
