import express, { Request, Response } from 'express';
import cors from 'cors';
import prisma from './lib/prisma';

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Get all todos
router.get('/todos', async (_req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new todo
router.post('/todos', async (req: Request, res: Response) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Task text is required' });
  }

  try {
    const newTodo = await prisma.todo.create({
      data: { text: text.trim() }
    });
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to save task' });
  }
});

// Update todo completion status
router.put('/todos/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: { completed: !todo.completed }
    });
    res.json(updated);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Update failed' });
  }
});

// Delete a todo
router.delete('/todos/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await prisma.todo.delete({ where: { id } });
    res.sendStatus(204); // Using 204 No Content for successful deletion
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Deletion failed' });
  }
});

app.use('/api', router);

async function start() {
  try {
    await prisma.$connect();
    console.log('Database connected');

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
}

start();
