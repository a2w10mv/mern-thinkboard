import api from "../lib/axios";
import { ArrowLeftIcon, FileTextIcon, ListTodoIcon, XIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";

const CreatePage = () => {
  const [type, setType] = useState("note");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tasks, setTasks] = useState([{ text: "", completed: false }]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleTaskTextChange = (index, newText) => {
    const newTasks = [...tasks];
    newTasks[index].text = newText;
    setTasks(newTasks);
  };

  const handleAddTask = () => {
    setTasks([...tasks, { text: "", completed: false }]);
  };

  const handleRemoveTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (type === "note" && !content.trim()) {
      toast.error("Content is required for notes");
      return;
    }

    // Filter out completely empty tasks
    const validTasks = type === "todo" ? tasks.filter(t => t.text.trim()) : [];

    if (type === "todo" && validTasks.length === 0) {
      toast.error("At least one valid task is required for a to-do list");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notes", {
        type,
        title,
        content: type === "note" ? content : "",
        tasks: validTasks,
      });
      toast.success(`${type === 'note' ? 'Note' : 'To-Do List'} created successfully`);
      navigate("/");
    } catch (error) {
      console.log(`Error creating ${type}, ${error}`);
      if (error.response?.status === 429) {
        toast.error("Slow down! You're creating items too fast", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error(`Failed to create ${type}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={"min-h-screen bg-base-200"}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Dashboard
          </Link>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Create New Item</h2>

              {/* Type Selector */}
              <div className="flex bg-base-200 p-1 rounded-box mb-6">
                <button
                  className={`flex-1 btn btn-sm ${type === 'note' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setType('note')}
                >
                  <FileTextIcon className="size-4 mr-2" />
                  Note
                </button>
                <button
                  className={`flex-1 btn btn-sm ${type === 'todo' ? 'btn-secondary' : 'btn-ghost'}`}
                  onClick={() => setType('todo')}
                >
                  <ListTodoIcon className="size-4 mr-2" />
                  To-Do List
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter title here..."
                    className="input input-bordered focus:input-primary"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {type === "note" ? (
                  <div className="form-control mb-6">
                    <label className="label">
                      <span className="label-text font-medium">Content</span>
                    </label>
                    <textarea
                      placeholder="Write your note here..."
                      className="textarea textarea-bordered h-40 focus:textarea-primary"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="form-control mb-6">
                    <label className="label">
                      <span className="label-text font-medium">Tasks</span>
                    </label>
                    <div className="space-y-3">
                      {tasks.map((task, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={`Task ${index + 1}`}
                            className="input input-bordered flex-1 focus:input-secondary"
                            value={task.text}
                            onChange={(e) => handleTaskTextChange(index, e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn btn-ghost btn-square text-error"
                            onClick={() => handleRemoveTask(index)}
                            disabled={tasks.length === 1}
                          >
                            <XIcon className="size-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline btn-secondary btn-sm mt-4 w-full"
                      onClick={handleAddTask}
                    >
                      <PlusIcon className="size-4 mr-1" /> Add Another Task
                    </button>
                  </div>
                )}

                <div className="card-actions justify-end mt-4 pt-4 border-t border-base-200">
                  <Link to="/" className="btn btn-ghost">Cancel</Link>
                  <button
                    type="submit"
                    className={`btn ${type === 'note' ? 'btn-primary' : 'btn-secondary'}`}
                    disabled={loading}
                  >
                    {loading ? "Creating..." : `Create ${type === 'note' ? 'Note' : 'List'}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;
