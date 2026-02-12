/**
 * TodoForm Component
 * Renders an input field and handles the submission of new tasks
 */

import { useState } from 'react';

export default function TodoForm({ onAdd }) {
  // Local state to manage the value of the input field
  const [text, setText] = useState('');

  /**
   * Handles Form Submission
   * Prevents browser reload, validates input, and triggers the onAdd callback
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    
    // Don't add empty tasks
    if (!trimmed) return;
    
    // Call the parent component's addition function
    onAdd(trimmed);
    
    // Reset the input field for the next task
    setText('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={text} // Controlled component bound to state
          onChange={(e) => setText(e.target.value)}
          autoComplete="off"
        />
      </div>
      <button type="submit">Add</button>
    </form>
  );
}
