import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

export default mongoose.model('Todo', todoSchema); 