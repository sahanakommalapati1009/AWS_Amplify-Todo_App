import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
    return () => sub.unsubscribe();
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) client.models.Todo.create({ content });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  const username = user?.signInDetails?.loginId?.split("@")[0];
  const pastelColors = ["#cce5ff", "#e2e3ff", "#d4edda", "#fff3cd", "#f8d7da", "#f0e5ff"];

  return (
    <div style={{ fontFamily: 'cursive', background: '#fff0f5', minHeight: '100vh', width: '100vw', padding: '2rem', boxSizing: 'border-box' }}>
      <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '12px', boxShadow: '0 0 15px rgba(0, 0, 0, 0.08)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2.5rem', fontStyle: 'italic', color: '#3b3b3b' }}>🎀 Todo App </h1>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'cursive' }}>🌸 {username}'s Todo List</h2>
          <button onClick={signOut} style={{ background: '#ffd6d6', color: '#000', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 'bold' }}>Sign out</button>
        </header>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Tasks</h3>
          <button onClick={createTodo} style={{ background: '#d6f5ff', color: '#000', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 'bold' }}>+ Add New Task</button>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {todos.map((todo, index) => (
            <div
              key={todo.id}
              style={{
                background: pastelColors[index % pastelColors.length],
                padding: '1rem',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                width: '250px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out'
              }}
              onClick={() => deleteTodo(todo.id)}
            >
              <h4 style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>{todo.content}</h4>
              <p style={{ fontSize: '0.85rem', color: '#333' }}>Click to delete</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;