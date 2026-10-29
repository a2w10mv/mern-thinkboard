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
  ListTodoIcon
} from "lucide-react";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";
import useTasks from "../hooks/useTasks";

const TodoCard = ({ note, setNotes }) => {
  const [expanded, setExpanded] = useState(false);
  const [tasks, setTasks] = useState(note.tasks || []);

  // Inline edit state
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const { tasks: editTasks, setTasks: setEditTasks, handleTaskTextChange, handleAddTask, handleRemoveTask } = useTasks([...(note.tasks || [])]);
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

  const toggleExpand = () => {
    if (editing) return;
    setExpanded((prev) => !prev);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const isAllDone = totalCount > 0 && completedCount === totalCount;

  return (
    <div
      className={`card bg-base-100 transition-all duration-300 border border-base-300 border-t-4 border-t-secondary cursor-pointer self-start group ${
        expanded ? "shadow-xl h-auto ring-2 ring-secondary/20" : "shadow hover:shadow-md h-full hover:border-secondary/50"
      }`}
      onClick={toggleExpand}
    >
      <div className="card-body p-5 flex flex-col h-full">
        {/* Header: Title + Expand Icon */}
        <div className="flex items-start justify-between shrink-0 mb-2 gap-2">
          {editing ? (
            <input
              type="text"
              className="input input-bordered input-sm flex-1 font-bold text-lg focus:outline-secondary/50 focus:border-secondary"
              value={editTitle}
              maxLength={100}
              onChange={(e) => setEditTitle(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2">
               <h3 className={`card-title text-lg font-bold leading-tight group-hover:text-secondary transition-colors ${isAllDone ? 'text-base-content/60 line-through' : 'text-base-content'}`}>{note.title}</h3>
               {isAllDone && !expanded && <CheckCircle2Icon className="size-4 text-secondary/70 shrink-0" />}
            </div>
          )}
          <button className={`btn btn-ghost btn-xs btn-circle bg-base-200/50 hover:bg-base-300 text-base-content/50 hover:text-base-content transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>
             <ChevronDownIcon className="size-4" />
          </button>
        </div>

        {/* Progress Bar (not shown while editing) */}
        {!editing && totalCount > 0 && (
          <div className="mb-4 shrink-0 px-1">
            <div className="flex justify-between text-[11px] text-base-content/50 mb-1.5 font-bold uppercase tracking-wider">
              <span>Progress</span>
              <span className={isAllDone ? "text-secondary" : ""}>{completedCount}/{totalCount} ({progress}%)</span>
            </div>
            <progress className={`progress h-2 w-full ${isAllDone ? 'progress-success' : 'progress-secondary bg-secondary/10'}`} value={progress} max="100"></progress>
          </div>
        )}

        {/* Content: Tasks List */}
        <div className={`${expanded ? "" : "flex-1 overflow-hidden relative"}`}>
          {editing ? (
            <div className="space-y-2.5 mt-2" onClick={(e) => e.stopPropagation()}>
              {editTasks.map((task, index) => (
                <div key={index} className="flex items-center gap-2 group/task">
                  <div className={`shrink-0 ${task.completed ? 'text-secondary/50' : 'text-base-content/30'}`}>
                    {task.completed ? <CheckCircle2Icon className="size-5" /> : <CircleIcon className="size-5" />}
                  </div>
                  <input
                    type="text"
                    className={`input input-bordered input-sm flex-1 focus:outline-secondary/50 focus:border-secondary transition-colors ${task.completed ? 'opacity-50 line-through' : ''}`}
                    value={task.text}
                    placeholder="Task description..."
                    onChange={(e) => handleTaskTextChange(index, e.target.value)}
                  />
                  <button
                    className="btn btn-ghost btn-xs btn-square text-base-content/30 hover:text-error hover:bg-error/10 opacity-0 group-hover/task:opacity-100 focus:opacity-100 transition-all"
                    onClick={() => handleRemoveTask(index)}
                    title="Remove task"
                  >
                    <XIcon className="size-4" />
                  </button>
                </div>
              ))}
              <button
                className="btn btn-secondary btn-sm btn-outline w-full mt-3 border-dashed hover:border-solid bg-secondary/5"
                onClick={handleAddTask}
              >
                + Add Task
              </button>
            </div>
          ) : (
            <>
              <div className={`space-y-3 ${expanded ? "mb-2" : ""}`}>
                {tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-4 opacity-50">
                    <ListTodoIcon className="size-8 mb-2 text-base-content/20" />
                    <p className="text-sm font-medium">No tasks added yet.</p>
                  </div>
                ) : (
                  tasks.slice(0, expanded ? undefined : 3).map((task) => (
                    <div
                      key={task._id}
                      className={`flex items-start gap-3 group/item p-1.5 -mx-1.5 rounded-lg hover:bg-base-200/50 transition-colors cursor-pointer ${task.completed ? 'opacity-60' : ''}`}
                      onClick={(e) => toggleTaskCompletion(e, task._id)}
                    >
                      <button className={`mt-0.5 shrink-0 transition-all duration-300 ${task.completed ? 'text-secondary scale-110' : 'text-base-content/30 group-hover/item:text-secondary/50 group-hover/item:scale-105'}`}>
                        {task.completed ? <CheckCircle2Icon className="size-5 drop-shadow-sm" /> : <CircleIcon className="size-5" />}
                      </button>
                      <span className={`text-sm leading-relaxed transition-all duration-300 ${task.completed ? 'text-base-content/50 line-through decoration-secondary/50 decoration-2' : 'text-base-content/90 font-medium'}`}>
                        {task.text}
                      </span>
                    </div>
                  ))
                )}
                {!expanded && tasks.length > 3 && (
                  <div className="pt-2 text-center">
                    <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full">
                      +{tasks.length - 3} more tasks
                    </span>
                  </div>
                )}
              </div>
              {!expanded && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-base-100 to-transparent pointer-events-none"></div>
              )}
            </>
          )}
        </div>

        {/* Footer: Date + Actions */}
        <div className="flex justify-between items-center mt-auto pt-4 shrink-0 border-t border-base-200/50">
          <span className="text-[11px] font-medium text-base-content/50 uppercase tracking-wide">
            {formatDate(new Date(note.createdAt))}
          </span>
          <div className="flex items-center gap-1.5">
            {editing ? (
              <>
                <button
                  className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-error hover:bg-error/10"
                  onClick={handleCancelEdit}
                  title="Cancel"
                >
                  <XIcon className="size-4" />
                </button>
                <button
                  className="btn btn-secondary btn-sm btn-square"
                  onClick={handleSave}
                  disabled={saving}
                  title="Save"
                >
                  {saving ? <span className="loading loading-spinner loading-xs"></span> : <SaveIcon className="size-4" />}
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-ghost btn-sm btn-square text-base-content/50 hover:text-secondary hover:bg-secondary/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  onClick={handleEdit}
                  title="Edit to-do list"
                >
                  <PenSquareIcon className="size-4" />
                </button>
                <button
                  className="btn btn-ghost btn-sm btn-square text-base-content/50 hover:text-error hover:bg-error/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
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
