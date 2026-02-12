/**
 * TodoList Component
 * Renders the container for todos or an empty state message
 */

import TodoItem from './TodoItem.jsx';

export default function TodoList({ todos, onToggle, onDelete }) {
  // 1. Empty State: Shown when there are no tasks in the database
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">&mdash;</span>
        <p>No tasks yet</p>
        <p className="empty-hint">Type above to add your first task</p>
      </div>
    );
  }

  // 2. Main List view
  return (
    <>
      <div className="section-label">Tasks</div>
      <ul className="todo-list">
        {/* Map through the array of todos and render an item for each one */}
        {todos.map((todo, index) => (
          <TodoItem
            key={todo.id}          // Required for React performance optimization
            todo={todo}
            index={index}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </>
  );
}
