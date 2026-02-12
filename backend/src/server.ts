/**
 * Codex Backend Server
 * Express based API for managing Todos using Prisma and PostgreSQL
 */

import express, { Request, Response } from 'express';
import cors from 'cors'; // Cross-Origin Resource Sharing middleware
import prisma from './lib/prisma'; // Prisma singleton client

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Setup
app.use(cors()); // Enable CORS to allow the frontend to talk to this API
app.use(express.json()); // Parse incoming JSON request bodies

/**
 * Route: GET /todos
 */
app.get('/todos', async (_req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(todos);
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    res.status(500).json({ message: 'Failed to fetch todos' });
  }
});

/**
 * Route: POST /todos
 */
app.post('/todos', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ message: 'Text is required' });
      return;
    }

    const newTodo = await prisma.todo.create({
      data: { text: text.trim() }
    });

    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Failed to create todo:', error);
    res.status(500).json({ message: 'Failed to create todo' });
  }
});

/**
 * Route: PUT /todos/:id
 */
app.put('/todos/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = req.params.id;
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: { completed: !todo.completed }
    });

    res.json(updated);
  } catch (error) {
    console.error('Failed to update todo:', error);
    res.status(500).json({ message: 'Failed to update todo' });
  }
});

/**
 * Route: DELETE /todos/:id
 */
app.delete('/todos/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = req.params.id;
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }

    const deleted = await prisma.todo.delete({ where: { id } });
    res.json(deleted);
  } catch (error) {
    console.error('Failed to delete todo:', error);
    res.status(500).json({ message: 'Failed to delete todo' });
  }
});

/**
 * Start Server with Database Connection Test (Prompt 6)
 */
async function startServer() {
  try {
    // Attempt to connect to the database
    await prisma.$connect();
    console.log('✅ Database connected');

    // Start Express listener
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1); // Exit process if database is unreachable
  }
}

startServer();
