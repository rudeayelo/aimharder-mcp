import { DatabaseSync } from 'node:sqlite';
import { writeFile } from 'node:fs/promises';
import { getMigrations } from 'better-auth/db/migration';
import { createAuth } from '../src/auth.ts';

const db = new DatabaseSync(':memory:');
const auth = createAuth({
  AUTH_DB: db as never,
  AUTH_SECRET: 'schema-generation-placeholder-no-real-secret',
  BASE_URL: 'https://example.invalid',
});
const migration = await getMigrations(auth.options);
await writeFile(
  new URL('../migrations/0001-auth.sql', import.meta.url),
  `${await migration.compileMigrations()}\n`
);
db.close();
