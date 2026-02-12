export default function TodoItem({ todo, index, onToggle, onDelete }) {
  return (
    <li
      className={`todo-item${todo.completed ? ' completed-item' : ''}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <label className="todo-left">
        <span className="custom-checkbox">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          <span className="checkbox-visual">
            <svg viewBox="0 0 12 12" fill="none" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="2 6 5 9 10 3" />
            </svg>
          </span>
        </span>
        <span className={`todo-text${todo.completed ? ' completed' : ''}`}>
          {todo.text}
        </span>
      </label>
      <button className="delete-btn" onClick={() => onDelete(todo.id)}>
        Remove
      </button>
    </li>
  );
}
