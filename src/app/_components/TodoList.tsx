"use client";
import { useState } from "react";
import { trpc } from "../_trpc/client";
import { serverClient } from "../_trpc/serverClient";

export default function TodoList({
  initialTodos,
}: {
  initialTodos: Awaited<ReturnType<(typeof serverClient)["getTodos"]>>;
}) {
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
  const setDone = trpc.setDone.useMutation();
  const [content, setContent] = useState("");

  if (setDone.isLoading || addTodo.isLoading || getTodos.isLoading) {
  }
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
                onChange={async (e) => {
                  e.target.disabled=true
                  e.target.className = "loading loading-spinner loading-md scale-125";
                  setDone.mutate(
                    {
                      id: todo.id,
                      done: todo.done === false ? true : false,
                    },
                    {
                      onSettled: () => {
                        getTodos.refetch().then(()=>{
                          e.target.className="checkbox checkbox-primary"
                          e.target.disabled=false
                      });
                      },
                    }
                  );
                }}
              />
              <label htmlFor={`check-${todo.id}`}>{todo.name}</label>
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
      </div>
    </div>
  );
}
