import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "./../lib/axios";
import { LoaderIcon, toast } from "react-hot-toast";
import { ArrowLeftIcon, Trash2Icon, SaveIcon, FileTextIcon, ListTodoIcon, XIcon, PlusIcon } from "lucide-react";
import useTasks from "../hooks/useTasks";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { tasks, setTasks, handleTaskTextChange, handleAddTask, handleRemoveTask } = useTasks([]);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
        if (res.data.tasks) setTasks(res.data.tasks);
      } catch (error) {
        console.log("Error in fetching note", error);
        toast.error("Failed to fetch the note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, setTasks]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Item deleted");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the note:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleSave = async () => {
    if (!note.title.trim()) {
      toast.error("Please add a title");
      return;
    }

    if (note.type === "note" && !note.content?.trim()) {
      toast.error("Please add content");
      return;
    }

    const validTasks = note.type === "todo" ? tasks.filter(t => t.text.trim()) : [];

    if (note.type === "todo" && validTasks.length === 0) {
      toast.error("At least one valid task is required for a to-do list");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: note.title.trim(),
        content: note.type === "note" ? note.content.trim() : "",
        tasks: validTasks,
      };

      await api.put(`/notes/${id}`, payload);
      toast.success("Item updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the note: ", error);
      toast.error("Failed to update item");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center gap-4">
        <LoaderIcon className="animate-spin size-10 text-primary" />
        <span className="text-base-content/60 font-medium">Loading details...</span>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-error">Item not found</h2>
        <Link to="/" className="btn btn-primary">Go back home</Link>
      </div>
    );
  }

  const isNote = note.type === 'note';

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Dashboard
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-error btn-outline btn-sm"
            >
              <Trash2Icon className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>

          <div className="card bg-base-100 shadow-xl border-t-4 border-t-primary">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-base-200">
                <div className={`p-2 rounded-lg ${isNote ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                  {isNote ? <FileTextIcon className="size-6" /> : <ListTodoIcon className="size-6" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Edit {isNote ? 'Note' : 'To-Do List'}</h2>
                  <p className="text-xs text-base-content/50 mt-1 uppercase tracking-wider">
                    Created: {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-medium">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter title here..."
                  className="input input-bordered focus:input-primary text-lg font-semibold"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                  maxLength={100}
                />
              </div>

              {isNote ? (
                <div className="form-control mb-6">
                  <label className="label">
                    <span className="label-text font-medium">Content</span>
                  </label>
                  <textarea
                    placeholder="Write your note here..."
                    className="textarea textarea-bordered h-48 focus:textarea-primary text-base leading-relaxed"
                    value={note.content}
                    onChange={(e) => setNote({ ...note, content: e.target.value })}
                    maxLength={5000}
                  />
                </div>
              ) : (
                <div className="form-control mb-6">
                  <label className="label flex justify-between">
                    <span className="label-text font-medium">Tasks</span>
                    <span className="label-text-alt text-base-content/50">{tasks?.length || 0} items</span>
                  </label>
                  <div className="space-y-3 bg-base-200/30 p-4 rounded-xl border border-base-200">
                    {tasks && tasks.length > 0 ? tasks.map((task, index) => (
                      <div key={index} className="flex items-center gap-2 group">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            placeholder={`Task ${index + 1}`}
                            className={`input input-bordered w-full pr-10 focus:input-secondary ${task.completed ? 'opacity-60 line-through' : ''}`}
                            value={task.text}
                            maxLength={500}
                            onChange={(e) => handleTaskTextChange(index, e.target.value)}
                          />
                        </div>
                        <button
                          type="button"
                          className="btn btn-ghost btn-square text-base-content/40 hover:text-error hover:bg-error/10 shrink-0"
                          onClick={() => handleRemoveTask(index)}
                          disabled={tasks.length === 1}
                          title="Remove task"
                        >
                          <XIcon className="size-5" />
                        </button>
                      </div>
                    )) : (
                      <p className="text-center text-sm text-base-content/50 py-2">No tasks available.</p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-secondary btn-sm mt-4 w-full border-dashed hover:border-solid"
                    onClick={handleAddTask}
                  >
                    <PlusIcon className="size-4 mr-1" /> Add Another Task
                  </button>
                </div>
              )}

              <div className="card-actions justify-end mt-4 pt-4 border-t border-base-200">
                <Link to="/" className="btn btn-ghost">Cancel</Link>
                <button
                  className={`btn ${isNote ? 'btn-primary' : 'btn-secondary'}`}
                  disabled={saving}
                  onClick={handleSave}
                >
                  {saving ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="size-4 mr-1" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NoteDetailPage;
