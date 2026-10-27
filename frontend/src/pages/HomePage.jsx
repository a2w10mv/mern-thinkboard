import { useEffect, useState } from "react";
import api from "../lib/axios";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import TodoCard from "../components/TodoCard";
import NotesNotFound from "../components/NotesNotFound";
import SnowfallBackground from "../components/SnowfallBackground";
import FireworksBackground from "../components/FireworksBackground";
import { FileTextIcon, ListTodoIcon } from "lucide-react";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/notes");
        console.log("Fetched items:", res.data);
        setItems(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching items", error);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load dashboard items");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const notes = items.filter(item => item.type === 'note' || !item.type); // fallback for older items
  const todos = items.filter(item => item.type === 'todo');

  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  const isSnowfall = month === 11 && day >= 1 && day <= 25;
  const isFireworks = (month === 11 && day >= 26) || month === 0;

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10">
        <Navbar />
        {isRateLimited && <RateLimitedUI />}

        <div className="max-w-7xl mx-auto p-4 mt-6">
          {loading && (
            <div className="flex justify-center items-center py-20">
               <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
          )}

          {!loading && items.length === 0 && !isRateLimited && <NotesNotFound />}

          {isSnowfall && <SnowfallBackground />}
          {isFireworks && <FireworksBackground />}

          {!loading && items.length > 0 && !isRateLimited && (
            <div className="space-y-12">

              {/* Todos Section */}
              {todos.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-6 pb-2 border-b border-base-300">
                    <ListTodoIcon className="size-6 text-secondary" />
                    <h2 className="text-2xl font-bold text-base-content">To-Do Lists</h2>
                    <span className="badge badge-secondary badge-sm ml-2">{todos.length}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {todos.map((todo) => (
                      <TodoCard key={todo._id} note={todo} setNotes={setItems} />
                    ))}
                  </div>
                </section>
              )}

              {/* Notes Section */}
              {notes.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-6 pb-2 border-b border-base-300">
                    <FileTextIcon className="size-6 text-primary" />
                    <h2 className="text-2xl font-bold text-base-content">Notes</h2>
                    <span className="badge badge-primary badge-sm ml-2">{notes.length}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => (
                      <NoteCard key={note._id} note={note} setNotes={setItems} />
                    ))}
                  </div>
                </section>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default HomePage;
