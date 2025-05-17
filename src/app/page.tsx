'use client';
import { resolveSoa } from 'dns';
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

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

  const toggleComplete = async (id: number) => {
    const res = await fetch(`/api/todos/${id}`, { method: 'PATCH' });
    const updated = await res.json();
    setTodos(todos.map((todo) => (todo.id === id ? updated : todo)));
  };

  const deleteTodo = async (id: number) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const saveTitle = async (id: number) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title: editTitle }),
      headers: { 'Content-Type': 'application/json' },
    });

    const updated = await res.json();
    setTodos(todos.map((todo) => (todo.id === id ? updated : todo)));
    cancelEditing();
  };

  const deleteCompletedTodos = async () => {
    await fetch('/api/todos/completed', { method: 'DELETE' });
    setTodos(todos.filter((todo) => !todo.completed));
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Todo List</h1>
      <div className="my-4 flex space-x-2">
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
        {todos.some((todo) => todo.completed) && (
          <button
            onClick={deleteCompletedTodos}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            🗑 Clear Done
          </button>
        )}
      </div>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="border-b py-2 flex justify-between items-center"
          >
            {editingId === todo.id ? (
              <>
                <input
                  className="border px-2 py-1 mr-2 flex-1"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveTitle(todo.id)}
                    className="text-blue-600 text-sm"
                  >
                    💾 Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="text-gray-500 text-sm"
                  >
                    ✖ Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span
                  className={`flex-1 ${
                    todo.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {todo.title}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleComplete(todo.id)}
                    className={`text-sm ${
                      todo.completed ? 'text-yellow-500' : 'text-green-600'
                    }`}
                  >
                    {todo.completed ? '↩ Undo' : '✔ Done'}
                  </button>
                  <button
                    onClick={() => startEditing(todo)}
                    className="text-blue-500 text-sm"
                  >
                    ✏ Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 text-sm"
                  >
                    ✖ Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
