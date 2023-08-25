import { Kysely ,sql} from 'kysely'
import {db} from '../src/db/database'

export async function up(db: Kysely<any>): Promise<void> {
        await db.schema.alterTable('done').renameColumn('created_at', 'ended_at').execute()
}
export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
}