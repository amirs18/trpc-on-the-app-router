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
    database: "test",
    host: "localhost",
    user: "postgres",
    password: "Aa123456",
    port: 5432,
    max: 10,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
});





