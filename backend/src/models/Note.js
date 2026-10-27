import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const taskSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
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
    },
    content: {
      type: String,
      required: function() { return this.type === 'note'; },
    },
    tasks: [taskSchema],
    replies: [replySchema],
  },
  { timestamps: true },
);

const Note = mongoose.model("Note", notesSchema);

export default Note;
