import { useState } from "react";
import {
  PenSquareIcon,
  Trash2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  SaveIcon,
  XIcon,
  CheckCircle2Icon,
  CircleIcon,
} from "lucide-react";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const TodoCard = ({ note, setNotes }) => {
  const [expanded, setExpanded] = useState(false);
  const [tasks, setTasks] = useState(note.tasks || []);

  // Inline edit state
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editTasks, setEditTasks] = useState([...(note.tasks || [])]);
  const [saving, setSaving] = useState(false);

  const handleDelete = async (e, id) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this to-do list?")) return;

    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success("To-do list deleted successfully");
    } catch (e) {
      console.log("Error in handleDelete", e);
      toast.error("Failed to delete to-do list");
    }
  };

  const toggleTaskCompletion = async (e, taskId) => {
    e.stopPropagation();
    if (editing) return;

    // Optimistic UI update
    const updatedTasks = tasks.map(task =>
      task._id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    setNotes((prev) =>
      prev.map((n) =>
        n._id === note._id
          ? { ...n, tasks: updatedTasks }
          : n
      )
    );

    try {
      // Send update to backend using the same update route, but we need to send all tasks
      await api.put(`/notes/${note._id}`, {
        title: note.title,
        content: note.content || "", // Content is optional for todos now, but we send empty string just in case
        tasks: updatedTasks,
      });
    } catch (error) {
      console.log("Error toggling task", error);
      // Revert on failure
      setTasks(tasks);
      setNotes((prev) =>
        prev.map((n) =>
          n._id === note._id
            ? { ...n, tasks: tasks }
            : n
        )
      );
      toast.error("Failed to update task");
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
    setEditTasks([...tasks]);
  };

  const handleSave = async (e) => {
    e.stopPropagation();

    if (!editTitle.trim()) {
      toast.error("Title is required");
      return;
    }

    // Filter out completely empty tasks
    const validTasks = editTasks.filter(t => t.text.trim());

    setSaving(true);
    try {
      const res = await api.put(`/notes/${note._id}`, {
        title: editTitle.trim(),
        content: "",
        tasks: validTasks,
      });
      // Update the note in the parent list
      setNotes((prev) =>
        prev.map((n) =>
          n._id === note._id
            ? {
                ...n,
                title: res.data.note.title,
                tasks: res.data.note.tasks,
              }
            : n,
        ),
      );
      setTasks(res.data.note.tasks);
      setEditing(false);
      toast.success("To-do list updated!");
    } catch (error) {
      console.log("Error saving todo", error);
      toast.error("Failed to update to-do list");
    } finally {
      setSaving(false);
    }
  };

  const handleTaskTextChange = (index, newText) => {
    const newTasks = [...editTasks];
    newTasks[index].text = newText;
    setEditTasks(newTasks);
  };

  const handleAddTask = () => {
    setEditTasks([...editTasks, { text: "", completed: false }]);
  };

  const handleRemoveTask = (index) => {
    const newTasks = [...editTasks];
    newTasks.splice(index, 1);
    setEditTasks(newTasks);
  };

  const toggleExpand = () => {
    if (editing) return;
    setExpanded((prev) => !prev);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div
      className={`card bg-base-100 transition-all duration-300 border border-base-300 border-t-4 border-t-secondary cursor-pointer self-start ${
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

        {/* Progress Bar (not shown while editing) */}
        {!editing && totalCount > 0 && (
          <div className="mb-3 shrink-0">
            <div className="flex justify-between text-xs text-base-content/60 mb-1 font-medium">
              <span>Progress</span>
              <span>{completedCount}/{totalCount} ({progress}%)</span>
            </div>
            <progress className="progress progress-secondary w-full" value={progress} max="100"></progress>
          </div>
        )}

        {/* Content: Tasks List */}
        <div className={`${expanded ? "" : "flex-1 overflow-hidden relative"}`}>
          {editing ? (
            <div className="space-y-2 mt-2" onClick={(e) => e.stopPropagation()}>
              {editTasks.map((task, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="text-base-content/40">
                    {task.completed ? <CheckCircle2Icon className="size-5" /> : <CircleIcon className="size-5" />}
                  </div>
                  <input
                    type="text"
                    className="input input-bordered input-sm flex-1"
                    value={task.text}
                    placeholder="Task description..."
                    onChange={(e) => handleTaskTextChange(index, e.target.value)}
                  />
                  <button
                    className="btn btn-ghost btn-xs text-error"
                    onClick={() => handleRemoveTask(index)}
                  >
                    <XIcon className="size-4" />
                  </button>
                </div>
              ))}
              <button
                className="btn btn-secondary btn-outline btn-sm w-full mt-2"
                onClick={handleAddTask}
              >
                + Add Task
              </button>
            </div>
          ) : (
            <>
              <div className={`space-y-2.5 ${expanded ? "" : ""}`}>
                {tasks.length === 0 ? (
                  <p className="text-base-content/50 text-sm italic">No tasks added yet.</p>
                ) : (
                  tasks.slice(0, expanded ? undefined : 3).map((task) => (
                    <div
                      key={task._id}
                      className="flex items-start gap-3 group"
                      onClick={(e) => toggleTaskCompletion(e, task._id)}
                    >
                      <button className={`mt-0.5 shrink-0 transition-colors ${task.completed ? 'text-secondary' : 'text-base-content/30 group-hover:text-secondary/50'}`}>
                        {task.completed ? <CheckCircle2Icon className="size-5" /> : <CircleIcon className="size-5" />}
                      </button>
                      <span className={`text-sm leading-relaxed transition-all ${task.completed ? 'text-base-content/40 line-through' : 'text-base-content/80'}`}>
                        {task.text}
                      </span>
                    </div>
                  ))
                )}
                {!expanded && tasks.length > 3 && (
                  <p className="text-xs text-secondary font-medium pt-1">
                    +{tasks.length - 3} more tasks
                  </p>
                )}
              </div>
              {!expanded && (
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-base-100 to-transparent pointer-events-none"></div>
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
            {editing ? (
              <>
                <button
                  className="btn btn-ghost btn-xs text-base-content/60 hover:text-base-content"
                  onClick={handleCancelEdit}
                >
                  <XIcon className="size-4" />
                </button>
                <button
                  className="btn btn-secondary btn-xs"
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
                  className="btn btn-ghost btn-xs btn-square text-base-content/60 hover:text-secondary hover:bg-secondary/10 transition-colors"
                  onClick={handleEdit}
                  title="Edit to-do list"
                >
                  <PenSquareIcon className="size-4" />
                </button>
                <button
                  className="btn btn-ghost btn-xs btn-square text-base-content/60 hover:text-error hover:bg-error/10 transition-colors"
                  onClick={(e) => handleDelete(e, note._id)}
                  title="Delete to-do list"
                >
                  <Trash2Icon className="size-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
