import { Kysely ,sql} from 'kysely'
import {db} from '../src/db/database'

export async function up(db: Kysely<any>): Promise<void> {
        await db.schema.alterTable('todo').addColumn('updated_at', 'timestamp',(col)=> col.defaultTo(sql`now()`)).execute()
}
