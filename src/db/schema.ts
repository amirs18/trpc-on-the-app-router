import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface Database {
  todo: TodoTable

}
export interface TodoTable {
  id: Generated<number>
  name: string
  done:boolean
  created_at: ColumnType<Date, string | undefined, never>
  updated_at: ColumnType<Date, string | undefined,Date| undefined>

}
export type Todo = Selectable<TodoTable>
export type NewTodo = Insertable<TodoTable>
export type TodoUpdate = Updateable<TodoTable>