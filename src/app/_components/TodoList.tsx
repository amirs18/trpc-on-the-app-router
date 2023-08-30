"use client";
import { useState } from "react";
import { trpc } from "../_trpc/client";
import { serverClient } from "../_trpc/serverClient";
import { signIn, signOut, useSession } from "next-auth/react";
import { json } from "stream/consumers";

export default function TodoList({
  initialTodos,
}: {
  initialTodos: Awaited<ReturnType<(typeof serverClient)["getTodos"]>>;
}) {
  const { data: sessionData } = useSession();
  const getTodos = trpc.getTodos.useQuery(undefined, {
    initialData: initialTodos,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const addTodo = trpc.addTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });
  const setDone = trpc.setDone.useMutation({
    async onSettled(data, error, variables, context) {
      await getTodos.refetch();
      const element = document.getElementById(`check-${data?.id}`);
      if (element) element.className = "checkbox checkbox-primary";
    },
  });

  const del = trpc.delete.useMutation();

  const [content, setContent] = useState("");
  return (
    <div>
      <div className="text-black my-5 text-3xl">
        {getTodos?.data
          ?.sort((a, b) => {
            if (a.created_at > b.created_at) return -1;
            if (a.created_at < b.created_at) return 1;
            return 0;
          })
          .map((todo) => (
            <div key={todo.id} className="flex gap-3 items-center">
              <input
                id={`check-${todo.id}`}
                type="checkbox"
                checked={todo.done}
                className="checkbox checkbox-primary "
                onChange={(e) => {
                  e.target.className =
                    "loading loading-spinner loading-md scale-125";
                  setDone.mutate({
                    id: todo.id,
                    done: todo.done === false ? true : false,
                  });
                }}
              />
              <label htmlFor={`check-${todo.id}`}>{todo.name}</label>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer"
                onClick={(e) => {
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML = "";
                  }
                  del.mutate(
                    { id: todo.id },
                    {
                      onSettled: () => {
                        getTodos.refetch();
                      },
                    }
                  );
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </div>
          ))}
      </div>
      <div className="flex gap-3 items-center">
        <label htmlFor="content">Content</label>
        <input
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-grow text-black bg-white rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
        />
        <button
          onClick={async () => {
            if (content.length) {
              addTodo.mutate({ name: content, done: false });
              setContent("");
            }
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Add Todo
        </button>
        <a
          onClick={async () => {
            if (sessionData?.user) signOut();
            else signIn();
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          {sessionData?.user ? <>logout</> : <>login</>}
        </a>
      </div>
    </div>
  );
}
