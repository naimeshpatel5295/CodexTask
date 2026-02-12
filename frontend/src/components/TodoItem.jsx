/**
 * TodoItem Component
 * Renders a single task with its completion status and a delete button
 */

export default function TodoItem({ todo, index, onToggle, onDelete }) {
  return (
    <li
      // Dynamically add 'completed-item' class if the task is done
      className={`todo-item${todo.completed ? ' completed-item' : ''}`}
      // stagger animation for each item based on its index
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <label className="todo-left">
        <span className="custom-checkbox">
          {/* Hidden native checkbox handled by the visual wrapper */}
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          {/* Custom SVG checkmark for better aesthetics */}
          <span className="checkbox-visual">
            <svg viewBox="0 0 12 12" fill="none" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="2 6 5 9 10 3" />
            </svg>
          </span>
        </span>
        
        {/* The Task Text: Strike-through if completed */}
        <span className={`todo-text${todo.completed ? ' completed' : ''}`}>
          {todo.text}
        </span>
      </label>

      {/* Action: Permanently remove task */}
      <button className="delete-btn" onClick={() => onDelete(todo.id)}>
        Remove
      </button>
    </li>
  );
}
