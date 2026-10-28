import Note from "../models/Note.js";

export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find({ owner: req.user.userId }).sort({ order: 1, createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getNoteById(req, res) {
  try {
    const noteById = await Note.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!noteById) return res.status(404).json({ message: "Note not found" });

    res.status(200).json({ message: "You just fetched the note", note: noteById });
  } catch (error) {
    console.error("Error in getNoteById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content, type, tasks } = req.body;

    const note = new Note({
      title,
      content,
      type,
      tasks,
      order: -Date.now(),
      owner: req.user.userId,
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
    const { title, content, tasks } = req.body;

    const updateNote = await Note.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      { title, content, tasks },
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
    const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user.userId });
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

    const note = await Note.findOne({ _id: req.params.id, owner: req.user.userId });
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
    const { updates } = req.body; // Expecting [{ id: '...', order: 1 }, ...]

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ message: "Updates array is required" });
    }

    // Verify all notes belong to the user
    const noteIds = updates.map(update => update.id);
    const notesCount = await Note.countDocuments({ _id: { $in: noteIds }, owner: req.user.userId });

    if (notesCount !== noteIds.length) {
       return res.status(403).json({ message: "You don't have permission to reorder one or more notes" });
    }

    // Use bulkWrite for efficient multiple updates
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: update.id, owner: req.user.userId },
        update: { $set: { order: update.order } }
      }
    }));

    await Note.bulkWrite(bulkOps);

    res.status(200).json({ message: "Notes reordered successfully" });
  } catch (error) {
    console.error("Error in reorderNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
