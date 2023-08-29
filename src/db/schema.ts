import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface AccountTable {
  id: Generated<string>;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: ColumnType<Date, Date | string, Date | string>;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
}

export interface SessionTable {
  id: Generated<string>;
  userId: string;
  sessionToken: string;
  expires: Timestamp;
}

export interface TodoTable {
  id: Generated<number>;
  done: boolean;
  name: string;
  created_at: Generated<ColumnType<Date, Date | string, never>>;
  updated_at: Timestamp | null;
}

export interface UserTable {
  id: Generated<string>;
  name: string | null;
  email: string;
  emailVerified: Timestamp | null;
  image: string | null;
}

export interface VerificationTokenTable {
  identifier: string;
  token: string;
  expires: Timestamp;
}

export interface Database {
  Account: AccountTable;
  Session: SessionTable;
  todo: TodoTable;
  User: UserTable;
  VerificationToken: VerificationTokenTable;
}


export interface Database {
  Account: AccountTable;
  Session: SessionTable;
  todo: TodoTable;
  User: UserTable;
  VerificationToken: VerificationTokenTable;
}
export type Todo = Selectable<TodoTable>;
export type NewTodo = Insertable<TodoTable>;
export type TodoUpdate = Updateable<TodoTable>;

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export type Account = Selectable<AccountTable>;
export type NewAccount = Insertable<AccountTable>;
export type AccountUpdate = Updateable<AccountTable>;
