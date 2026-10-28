import Note from "../models/Note.js";

export async function getAllNotes(_, res) {
  try {
    const notes = await Note.find().sort({ 'layout.y': 1, 'layout.x': 1, createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getNoteById(req, res) {
  try {
    const noteById = await Note.findById(req.params.id);
    if (!noteById) return res.status(404).json({ message: "Note not found" });

    res.status(200).json({ message: "You just fetched the note", note: noteById });
  } catch (error) {
    console.error("Error in getNoteById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content, type, tasks, layout } = req.body;

    // Set default dimensions based on type
    const defaultLayout = layout || { x: 0, y: Infinity, w: 2, h: 2 };

    const note = new Note({
      title,
      content,
      type,
      tasks,
      layout: defaultLayout,
      order: -Date.now()
    });

    const savedNote = await note.save();
    res.status(201).json({ note: savedNote });
  } catch (error) {
    console.error("Error in createNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateNote(req, res) {
  try {
    const { title, content, tasks, layout } = req.body;

    const updateData = { title, content, tasks };
    if (layout) updateData.layout = layout;

    const updateNote = await Note.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updateNote) return res.status(404).json({ message: "Note not found" });

    res.status(200).json({ message: "Note updated successfully", note: updateNote });
  } catch (error) {
    console.error("Error in updateNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteNote(req, res) {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ message: "Note not found" });

    res.status(200).json({ message: "Note deleted successfully", deletedNote: deletedNote });
  } catch (error) {
    console.error("Error in deleteNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addReply(req, res) {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Reply content is required" });
    }

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.replies.push({ content: content.trim() });
    const savedNote = await note.save();

    res.status(201).json({ note: savedNote });
  } catch (error) {
    console.error("Error in addReply controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function reorderNotes(req, res) {
  try {
    const { updates } = req.body;
    // Expecting [{ id: '...', layout: { x: 0, y: 0, w: 2, h: 2 } }, ...]

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ message: "Updates array is required" });
    }

    const bulkOps = updates.map(update => {
      const updateData = {};
      if (update.order !== undefined) updateData.order = update.order;
      if (update.layout) updateData.layout = update.layout;

      return {
        updateOne: {
          filter: { _id: update.id },
          update: { $set: updateData }
        }
      };
    });

    await Note.bulkWrite(bulkOps);

    res.status(200).json({ message: "Layout updated successfully" });
  } catch (error) {
    console.error("Error in reorderNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function seedWidgets(req, res) {
  try {
    const types = ['time', 'weather', 'timer', 'mascot'];
    const createdWidgets = [];

    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      const existing = await Note.findOne({ type });
      if (!existing) {
        let w = 2, h = 2;
        if (type === 'time') { w = 2; h = 1; }
        if (type === 'timer') { w = 2; h = 2; }
        if (type === 'weather') { w = 2; h = 2; }
        if (type === 'mascot') { w = 2; h = 3; }

        const note = new Note({
          type,
          title: type, // Optional placeholder since required is false for these
          layout: { x: (i % 3) * 2, y: 0, w, h }
        });
        const saved = await note.save();
        createdWidgets.push(saved);
      }
    }

    res.status(200).json(createdWidgets);
  } catch (error) {
    console.error("Error in seedWidgets controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
