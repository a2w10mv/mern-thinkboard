import Note from "../models/Note.js";

export async function getAllNotes(_, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
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
    const { title, content, type, tasks } = req.body;
    const note = new Note({ title, content, type, tasks });

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

    const updateNote = await Note.findByIdAndUpdate(
      req.params.id,
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
