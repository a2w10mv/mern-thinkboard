import { useState } from "react";
import {
  PenSquareIcon,
  Trash2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  SendIcon,
  MessageCircleIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const NoteCard = ({ note, setNotes }) => {
  const [expanded, setExpanded] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [replies, setReplies] = useState(note.replies || []);

  // Inline edit state
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [saving, setSaving] = useState(false);

  const handleDelete = async (e, id) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success("Note deleted successfully");
    } catch (e) {
      console.log("Error in handleDelete", e);
      toast.error("Failed to delete note");
    }
  };

  const handleReplySubmit = async (e) => {
    e.stopPropagation();

    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    setSubmittingReply(true);
    try {
      const res = await api.post(`/notes/${note._id}/replies`, {
        content: replyContent,
      });
      setReplies(res.data.note.replies);
      setReplyContent("");
      toast.success("Reply added!");
    } catch (error) {
      console.log("Error adding reply", error);
      toast.error("Failed to add reply");
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (!expanded) setExpanded(true);
    setEditing(true);
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditing(false);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleSave = async (e) => {
    e.stopPropagation();

    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setSaving(true);
    try {
      const res = await api.put(`/notes/${note._id}`, {
        title: editTitle.trim(),
        content: editContent.trim(),
      });
      // Update the note in the parent list
      setNotes((prev) =>
        prev.map((n) =>
          n._id === note._id
            ? {
                ...n,
                title: res.data.note.title,
                content: res.data.note.content,
              }
            : n,
        ),
      );
      // Update local display
      note.title = res.data.note.title;
      note.content = res.data.note.content;
      setEditing(false);
      toast.success("Note updated!");
    } catch (error) {
      console.log("Error saving note", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  const toggleExpand = () => {
    if (editing) return; // Don't collapse while editing
    setExpanded((prev) => !prev);
  };

  return (
    <div
      className={`card bg-base-100 transition-all duration-300 border-t-4 border-solid border-[#6cbde0] cursor-pointer self-start ${
        expanded ? "shadow-xl h-auto" : "hover:shadow-lg h-52"
      }`}
      onClick={toggleExpand}
    >
      <div className="card-body flex flex-col h-full">
        {/* Header: Title + Expand Icon */}
        <div className="flex items-center justify-between shrink-0">
          {editing ? (
            <input
              type="text"
              className="input input-bordered input-sm flex-1 mr-2 font-semibold"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3 className="card-title text-base-content">{note.title}</h3>
          )}
          {expanded ? (
            <ChevronUpIcon className="size-5 text-base-content/50 shrink-0" />
          ) : (
            <ChevronDownIcon className="size-5 text-base-content/50 shrink-0" />
          )}
        </div>

        {/* Content */}
        <div className={`${expanded ? "" : "flex-1 overflow-hidden"}`}>
          {editing ? (
            <textarea
              className="textarea textarea-bordered w-full mt-2"
              rows={4}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <p
              className={`text-base-content/70 ${
                expanded ? "whitespace-pre-wrap" : "line-clamp-3"
              }`}
            >
              {note.content}
            </p>
          )}
        </div>

        {/* Footer: Date + Actions */}
        <div className="card-actions justify-between items-center mt-auto pt-4 shrink-0">
          <span className="text-sm text-base-content/60">
            {formatDate(new Date(note.createdAt))}
          </span>
          <div className="flex items-center gap-1">
            {replies.length > 0 && !editing && (
              <span className="flex items-center gap-1 text-sm text-base-content/50 mr-1">
                <MessageCircleIcon className="size-3.5" />
                {replies.length}
              </span>
            )}
            {editing ? (
              <>
                <button
                  className="btn btn-ghost btn-xs"
                  aria-label="Cancel edit"
                  onClick={handleCancelEdit}
                >
                  <XIcon className="size-4" />
                </button>
                <button
                  className="btn btn-primary btn-xs"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <SaveIcon className="size-4" />
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-ghost btn-xs" aria-label="Edit note" onClick={handleEdit}>
                  <PenSquareIcon className="size-4" />
                </button>
                <button
                  className="btn btn-ghost btn-xs text-error"
                  aria-label="Delete note"
                  onClick={(e) => handleDelete(e, note._id)}
                >
                  <Trash2Icon className="size-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Expanded Section: Replies */}
        {expanded && !editing && (
          <div
            className="mt-4 border-t border-base-content/10 pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Replies List */}
            {replies.length > 0 && (
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                {replies.map((reply) => (
                  <div key={reply._id} className="bg-base-200 rounded-lg p-3">
                    <p className="text-sm text-base-content/80 whitespace-pre-wrap">
                      {reply.content}
                    </p>
                    <span className="text-xs text-base-content/40 mt-1 block">
                      {formatDate(new Date(reply.createdAt))}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {replies.length === 0 && (
              <p className="text-sm text-base-content/40 italic mb-4">
                No replies yet. Be the first to reply!
              </p>
            )}

            {/* Reply Form */}
            <div className="flex gap-2">
              <textarea
                className="textarea textarea-bordered flex-1 textarea-sm"
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
              />
              <button
                className="btn btn-primary btn-sm self-end"
                aria-label="Submit reply"
                onClick={handleReplySubmit}
                disabled={submittingReply}
              >
                {submittingReply ? "..." : <SendIcon className="size-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
