import api from "../lib/axios";
import { ArrowLeftIcon, FileTextIcon, ListTodoIcon, XIcon, PlusIcon, SaveIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";

const CreatePage = () => {
  const [type, setType] = useState("note");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tasks, setTasks] = useState([{ text: "", completed: false }]);
  const [loading, setLoading] = useState(false);

  const titleInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Focus title input on mount and when type changes
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [type]);

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

  const handleKeyDown = (e, index) => {
    // Add new task when pressing Enter in a task input (if it's not empty)
    if (e.key === 'Enter' && type === 'todo') {
      e.preventDefault();
      if (tasks[index].text.trim()) {
        handleAddTask();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      titleInputRef.current?.focus();
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
        title: title.trim(),
        content: type === "note" ? content.trim() : "",
        tasks: validTasks,
      });
      toast.success(`${type === 'note' ? 'Note' : 'To-Do List'} created successfully`);
      navigate("/");
    } catch (error) {
      console.error(`Error creating ${type}, ${error}`);
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
          <Link to={"/"} className="btn btn-ghost mb-6 hover:bg-base-300">
            <ArrowLeftIcon className="size-5" />
            Back to Dashboard
          </Link>

          <div className={`card bg-base-100 shadow-xl border-t-4 transition-colors duration-300 ${type === 'note' ? 'border-t-primary' : 'border-t-secondary'}`}>
            <div className="card-body">
              <h2 className="card-title text-2xl mb-2">Create New Item</h2>
              <p className="text-sm text-base-content/60 mb-6">Choose what type of item you want to create and fill in the details below.</p>

              {/* Type Selector */}
              <div className="flex bg-base-200/50 p-1.5 rounded-xl mb-8 border border-base-200">
                <button
                  type="button"
                  className={`flex-1 btn btn-sm h-10 border-none transition-all duration-300 ${type === 'note' ? 'bg-primary text-primary-content hover:bg-primary/90 shadow-md scale-[1.02]' : 'bg-transparent text-base-content/70 hover:bg-base-300'}`}
                  onClick={() => setType('note')}
                >
                  <FileTextIcon className="size-4 mr-2" />
                  Note
                </button>
                <button
                  type="button"
                  className={`flex-1 btn btn-sm h-10 border-none transition-all duration-300 ${type === 'todo' ? 'bg-secondary text-secondary-content hover:bg-secondary/90 shadow-md scale-[1.02]' : 'bg-transparent text-base-content/70 hover:bg-base-300'}`}
                  onClick={() => setType('todo')}
                >
                  <ListTodoIcon className="size-4 mr-2" />
                  To-Do List
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-control mb-5">
                  <label className="label">
                    <span className="label-text font-medium text-base">Title</span>
                    <span className="label-text-alt text-base-content/50">{title.length}/100</span>
                  </label>
                  <input
                    ref={titleInputRef}
                    type="text"
                    placeholder="Enter a descriptive title..."
                    className={`input input-bordered input-lg w-full text-lg font-semibold transition-colors focus:outline-none focus:ring-2 ${type === 'note' ? 'focus:ring-primary/50 focus:border-primary' : 'focus:ring-secondary/50 focus:border-secondary'}`}
                    value={title}
                    maxLength={100}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className={`transition-all duration-300 ${type === 'note' ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden m-0 p-0'}`}>
                  <div className="form-control mb-6">
                    <label className="label">
                      <span className="label-text font-medium text-base">Content</span>
                      <span className="label-text-alt text-base-content/50">{content.length}/5000</span>
                    </label>
                    <textarea
                      placeholder="Write your note here... (Markdown is not currently supported)"
                      className="textarea textarea-bordered h-48 text-base leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      value={content}
                      maxLength={5000}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                </div>

                <div className={`transition-all duration-300 ${type === 'todo' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden m-0 p-0'}`}>
                  <div className="form-control mb-6">
                    <label className="label flex justify-between">
                      <span className="label-text font-medium text-base">Tasks</span>
                      <span className="label-text-alt text-base-content/50">{tasks.length} items</span>
                    </label>
                    <div className="space-y-3 bg-base-200/30 p-4 rounded-xl border border-base-200">
                      {tasks.map((task, index) => (
                        <div key={index} className="flex items-center gap-2 group">
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              placeholder={`Task ${index + 1}`}
                              className="input input-bordered w-full pr-10 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
                              value={task.text}
                              maxLength={500}
                              onChange={(e) => handleTaskTextChange(index, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, index)}
                              autoFocus={index === tasks.length - 1 && index > 0}
                            />
                          </div>
                          <button
                            type="button"
                            className="btn btn-ghost btn-square text-base-content/40 hover:text-error hover:bg-error/10 shrink-0 transition-colors"
                            onClick={() => handleRemoveTask(index)}
                            disabled={tasks.length === 1}
                            title="Remove task"
                            aria-label="Remove task"
                          >
                            <XIcon className="size-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline btn-secondary btn-sm mt-4 w-full border-dashed hover:border-solid bg-secondary/5"
                      onClick={handleAddTask}
                    >
                      <PlusIcon className="size-4 mr-1" /> Add Another Task
                    </button>
                  </div>
                </div>

                <div className="card-actions justify-end mt-8 pt-5 border-t border-base-200">
                  <Link to="/" className="btn btn-ghost">Cancel</Link>
                  <button
                    type="submit"
                    className={`btn ${type === 'note' ? 'btn-primary' : 'btn-secondary'} px-8`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="size-4 mr-2" />
                        Create {type === 'note' ? 'Note' : 'List'}
                      </>
                    )}
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
