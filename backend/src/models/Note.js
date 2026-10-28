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

const layoutSchema = new mongoose.Schema({
  x: { type: Number, default: 0 },
  y: { type: Number, default: Infinity },
  w: { type: Number, default: 2 },
  h: { type: Number, default: 2 }
});

const notesSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['note', 'todo', 'time', 'weather', 'timer', 'mascot'],
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
      default: () => Date.now(), // Legacy, keeping just in case
    },
    layout: {
      type: layoutSchema,
      default: () => ({ x: 0, y: Infinity, w: 2, h: 2 })
    },
    tasks: [taskSchema],
    replies: [replySchema],
  },
  { timestamps: true },
);

const Note = mongoose.model("Note", notesSchema);

export default Note;
