import { resolve } from 'path';

/**
 * Single `.env` lives at the monorepo root, not per-app. `src/config` and
 * `dist/config` sit at the same depth under `apps/api`, so this relative
 * path resolves correctly whether running via ts-node (`src`) or compiled
 * output (`dist`).
 */
export const ROOT_ENV_PATH = resolve(__dirname, '../../../../.env');
