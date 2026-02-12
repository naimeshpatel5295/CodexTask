/**
 * Codex Frontend - Main Application Component
 * Manages the state and communication with the Backend API
 */

import { useEffect, useState } from 'react';
import axios from 'axios';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';

// Axios Instance: Pre-configured to point to our backend API
const api = axios.create({
  baseURL: 'http://localhost:5000'
});

export default function App() {
  // State: List of todos fetched from the database
  const [todos, setTodos] = useState([]);
  
  // State: Tracks if initial data is still being loaded
  const [loading, setLoading] = useState(true);

  /**
   * Fetches the current list of tasks from the Backend
   */
  const fetchTodos = async () => {
    try {
      const res = await api.get('/todos');
      setTodos(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching todos", err);
    }
  };

  // Run initial fetch when the component first mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  /**
   * Adds a new task to the database
   * @param {string} text - The task description
   */
  const addTodo = async (text) => {
    const res = await api.post('/todos', { text });
    // Update local state with the new item returned by the server
    setTodos(prev => [...prev, res.data]);
  };

  /**
   * Toggles completion status (Done / Pending)
   * @param {string} id - UUID of the task
   */
  const toggleTodo = async (id) => {
    const res = await api.put(`/todos/${id}`);
    // Update only the specific item in the state
    setTodos(prev => prev.map(t => (t.id === id ? res.data : t)));
  };

  /**
   * Deletes a task from the database
   * @param {string} id - UUID of the task
   */
  const deleteTodo = async (id) => {
    await api.delete(`/todos/${id}`);
    // Remove the item from local state
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  /**
   * Helper: Deletes all items marked as 'completed'
   */
  const clearCompleted = () => {
    const completed = todos.filter(t => t.completed);
    completed.forEach(t => deleteTodo(t.id));
  };

  // UI Derived State (Calculated on every render)
  const totalCount = todos.length;
  const doneCount = todos.filter(t => t.completed).length;
  const pendingCount = totalCount - doneCount;
  const hasCompleted = doneCount > 0;

  return (
    <div className="page">
      {/* Visual background grain effect */}
      <div className="grain-overlay" />
      
      <div className="container">
        <header className="app-header">
          <h1>Codex<span className="accent-dot">.</span></h1>
          <p className="app-subtitle">Task Journal</p>
          <hr className="header-rule" />
        </header>

        {/* Status Dashboard: Only shown if tasks exist */}
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

        {/* Input Form for adding new tasks */}
        <TodoForm onAdd={addTodo} />

        {/* Task List / Loading State */}
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

        {/* Footer: Persistence summary and bulk actions */}
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
