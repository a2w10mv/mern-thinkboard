import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
  },
  { timestamps: true },
);

const taskSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      maxlength: 500,
    },
    completed: {
      type: Boolean,
      default: false,
    }
  }
);

const notesSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['note', 'todo'],
      default: 'note',
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    content: {
      type: String,
      required: function() { return this.type === 'note'; },
      maxlength: 5000,
    },
    order: {
      type: Number,
      default: () => Date.now(), // Automatically set based on creation time, allowing sorting
    },
    tasks: [taskSchema],
    replies: [replySchema],
  },
  { timestamps: true },
);

const Note = mongoose.model("Note", notesSchema);

export default Note;
