import { Database } from "./schema"; // this is the Database interface we defined earlier
import { Pool } from "pg"; // this is the Pool interface we defined earlier
import {
  Kysely,
  PostgresDialect,
  Migrator,
  MigrationProvider,
  FileMigrationProvider,
} from "kysely";
import path from "path";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
});





