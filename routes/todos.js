import express from 'express';
import Todo from '../models/Todo.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all todos for user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId }).select('-__v');
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new todo
router.post('/', auth, async (req, res) => {
  const { title, description } = req.body;
  try {
    const todo = new Todo({ user: req.userId, title, description });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Batch sync todos (for offline/online sync)
router.post('/batch', auth, async (req, res) => {
  const { todos } = req.body; // array of {title, description}
  if (!Array.isArray(todos)) return res.status(400).json({ message: 'Invalid payload' });
  try {
    // Find existing todos for user
    const existing = await Todo.find({ user: req.userId });
    const existingSet = new Set(existing.map(t => t.title + '|' + t.description));
    const newTodos = todos.filter(t => !existingSet.has(t.title + '|' + t.description));
    if (newTodos.length === 0) return res.json({ message: 'No new todos to sync' });
    const inserted = await Todo.insertMany(newTodos.map(t => ({ ...t, user: req.userId })));
    res.status(201).json({ message: 'Todos synced', inserted });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 