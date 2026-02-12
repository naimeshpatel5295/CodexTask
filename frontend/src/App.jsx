import { useEffect, useState } from 'react';
import axios from 'axios';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';

const api = axios.create({
  baseURL: 'http://localhost:5000'
});

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    const res = await api.get('/todos');
    setTodos(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (text) => {
    const res = await api.post('/todos', { text });
    setTodos(prev => [...prev, res.data]);
  };

  const toggleTodo = async (id) => {
    const res = await api.put(`/todos/${id}`);
    setTodos(prev => prev.map(t => (t.id === id ? res.data : t)));
  };

  const deleteTodo = async (id) => {
    await api.delete(`/todos/${id}`);
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    const completed = todos.filter(t => t.completed);
    completed.forEach(t => deleteTodo(t.id));
  };

  const totalCount = todos.length;
  const doneCount = todos.filter(t => t.completed).length;
  const pendingCount = totalCount - doneCount;
  const hasCompleted = doneCount > 0;

  return (
    <div className="page">
      <div className="grain-overlay" />
      <div className="container">
        <header className="app-header">
          <h1>Codex<span className="accent-dot">.</span></h1>
          <p className="app-subtitle">Task Journal</p>
          <hr className="header-rule" />
        </header>

        {!loading && totalCount > 0 && (
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-value">{totalCount}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat">
              <span className="stat-value accent">{pendingCount}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat">
              <span className="stat-value">{doneCount}</span>
              <span className="stat-label">Done</span>
            </div>
          </div>
        )}

        <TodoForm onAdd={addTodo} />

        {loading ? (
          <div className="loading-state">
            <div className="loading-bar">
              <div className="loading-bar-inner" />
            </div>
            <span className="loading-text">Loading tasks</span>
          </div>
        ) : (
          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        )}

        {!loading && totalCount > 0 && (
          <footer className="app-footer">
            <span className="footer-left">
              {pendingCount === 0
                ? 'All clear — well done'
                : `${pendingCount} task${pendingCount !== 1 ? 's' : ''} remaining`}
            </span>
            {hasCompleted && (
              <button className="clear-completed-btn" onClick={clearCompleted}>
                Clear done
              </button>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
