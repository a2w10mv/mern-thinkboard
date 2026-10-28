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
      console.error("Error in handleDelete", e);
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
      console.error("Error adding reply", error);
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
      console.error("Error saving note", error);
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
      className={`card bg-base-100 transition-all duration-300 border border-base-300 border-t-4 border-t-primary cursor-pointer self-start ${
        expanded ? "shadow-2xl h-auto" : "shadow-sm hover:shadow-md h-full"
      }`}
      onClick={toggleExpand}
    >
      <div className="card-body p-5 flex flex-col h-full">
        {/* Header: Title + Expand Icon */}
        <div className="flex items-start justify-between shrink-0 mb-2 gap-2">
          {editing ? (
            <input
              type="text"
              className="input input-bordered input-sm flex-1 font-bold text-lg"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3 className="card-title text-lg font-bold text-base-content leading-tight">{note.title}</h3>
          )}
          {expanded ? (
            <ChevronUpIcon className="size-5 text-base-content/40 shrink-0 mt-0.5" />
          ) : (
            <ChevronDownIcon className="size-5 text-base-content/40 shrink-0 mt-0.5" />
          )}
        </div>

        {/* Content */}
        <div className={`${expanded ? "" : "flex-1 overflow-hidden relative"}`}>
          {editing ? (
            <textarea
              className="textarea textarea-bordered w-full mt-2 resize-none"
              rows={5}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              <p
                className={`text-base-content/80 text-sm leading-relaxed ${
                  expanded ? "whitespace-pre-wrap" : "line-clamp-4"
                }`}
              >
                {note.content}
              </p>
              {!expanded && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-base-100 to-transparent pointer-events-none"></div>
              )}
            </>
          )}
        </div>

        {/* Footer: Date + Actions */}
        <div className="flex justify-between items-center mt-auto pt-4 shrink-0 border-t border-base-200/50">
          <span className="text-xs font-medium text-base-content/50">
            {formatDate(new Date(note.createdAt))}
          </span>
          <div className="flex items-center gap-2">
            {replies.length > 0 && !editing && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-base-content/60 mr-2 bg-base-200 px-2 py-1 rounded-full">
                <MessageCircleIcon className="size-3.5" />
                {replies.length}
              </span>
            )}
            {editing ? (
              <>
                <button
                  className="btn btn-ghost btn-xs text-base-content/60 hover:text-base-content"
                  onClick={handleCancelEdit}
                >
                  <XIcon className="size-4" />
                </button>
                <button
                  className="btn btn-primary btn-xs"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <SaveIcon className="size-4 mr-1" />
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-ghost btn-xs btn-square text-base-content/60 hover:text-primary hover:bg-primary/10 transition-colors"
                  onClick={handleEdit}
                  title="Edit note"
                >
                  <PenSquareIcon className="size-4" />
                </button>
                <button
                  className="btn btn-ghost btn-xs btn-square text-base-content/60 hover:text-error hover:bg-error/10 transition-colors"
                  onClick={(e) => handleDelete(e, note._id)}
                  title="Delete note"
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
            className="mt-5 pt-5 border-t border-base-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-sm font-semibold text-base-content/80 mb-3 flex items-center gap-2">
              <MessageCircleIcon className="size-4" />
              Replies
            </h4>

            {/* Replies List */}
            {replies.length > 0 ? (
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {replies.map((reply) => (
                  <div key={reply._id} className="bg-base-200/50 rounded-xl p-3 border border-base-300/50">
                    <p className="text-sm text-base-content/90 whitespace-pre-wrap leading-relaxed">
                      {reply.content}
                    </p>
                    <span className="text-[11px] font-medium text-base-content/40 mt-2 block uppercase tracking-wider">
                      {formatDate(new Date(reply.createdAt))}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-base-200/30 rounded-xl p-4 text-center mb-4 border border-base-300/30 border-dashed">
                <p className="text-sm text-base-content/50">
                  No replies yet. Be the first to reply!
                </p>
              </div>
            )}

            {/* Reply Form */}
            <div className="flex gap-2 items-end">
              <textarea
                className="textarea textarea-bordered flex-1 text-sm min-h-[2.5rem] resize-none focus:outline-primary/20"
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleReplySubmit(e);
                  }
                }}
              />
              <button
                className="btn btn-primary btn-sm btn-square"
                onClick={handleReplySubmit}
                disabled={submittingReply || !replyContent.trim()}
              >
                {submittingReply ? <span className="loading loading-spinner loading-xs"></span> : <SendIcon className="size-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
