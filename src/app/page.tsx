// app/page.tsx
'use client';
import { useEffect, useState } from 'react';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetch('/api/todos')
      .then((res) => res.json())
      .then(setTodos);
  }, []);

  const addTodo = async () => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const newTodo = await res.json();
    setTodos([newTodo, ...todos]);
    setTitle('');
  };

  const markAsCompleted = async (id: number) => {
    const res = await fetch(`/api/todos/${id}`, { method: 'PATCH' });
    const updated = await res.json();
    setTodos(todos.map((todo) => (todo.id === id ? updated : todo)));
  };

  const deleteTodo = async (id: number) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Todo List</h1>
      <div className="my-4">
        <input
          className="border px-2 py-1 mr-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Add
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="border-b py-2 flex justify-between items-center"
          >
            <span
              className={todo.completed ? 'line-through text-gray-500' : ''}
            >
              {todo.title}
            </span>
            <div className="flex gap-2">
              {!todo.completed && (
                <button
                  onClick={() => markAsCompleted(todo.id)}
                  className="text-green-600 text-sm"
                >
                  ✔ Done
                </button>
              )}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 text-sm"
              >
                ✖ Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
