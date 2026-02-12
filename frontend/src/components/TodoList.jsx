import TodoItem from './TodoItem.jsx';

export default function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">&mdash;</span>
        <p>No tasks yet</p>
        <p className="empty-hint">Type above to add your first task</p>
      </div>
    );
  }

  return (
    <>
      <div className="section-label">Tasks</div>
      <ul className="todo-list">
        {todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
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
