import { PostgresDialect, Kysely, Migrator, FileMigrationProvider } from "kysely";
import path from "path";
import { Pool } from "pg";
import { Database } from "./src/db/schema";
import { promises as fs } from "fs";


async function migrateToLatest() {
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
        const db = new Kysely<Database>({
          dialect,
        });

        
        const migrator = new Migrator({
          db: db,
          provider: new FileMigrationProvider({
            fs,
            path,
            // This needs to be an absolute path.
            migrationFolder: path.join(__dirname,'./migrations')
          }),
        })
        const m = await migrator.getMigrations()
        console.log(m);
        const { error, results } = await migrator.migrateToLatest()
      
        
      
        results?.forEach((it) => {
          if (it.status === 'Success') {
            console.log(`migration "${it.migrationName}" was executed successfully`)
          } else if (it.status === 'Error') {
            console.error(`failed to execute migration "${it.migrationName}"`)
          }
        })
      
        if (error) {
          console.error('failed to migrate')
          console.error(error)
          process.exit(1)
        }
      
        await db.destroy()
      }
      
      migrateToLatest()