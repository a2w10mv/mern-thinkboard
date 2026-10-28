import { useEffect, useState } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import api from "../lib/axios";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import toast from "react-hot-toast";

import NoteCard from "../components/NoteCard";
import TodoCard from "../components/TodoCard";
import TimeWidget from "../components/TimeWidget";
import WeatherWidget from "../components/WeatherWidget";
import TimerWidget from "../components/TimerWidget";
import MascotWidget from "../components/MascotWidget";

import NotesNotFound from "../components/NotesNotFound";
import { FileTextIcon, ListTodoIcon, GripHorizontalIcon } from "lucide-react";
import SnowfallBackground from "../components/SnowfallBackground";
import FireworksBackground from "../components/FireworksBackground";
import { LayoutGridIcon } from "lucide-react";

// For vite/rollup compatibility with react-grid-layout
import { Responsive } from "react-grid-layout";
import * as RGLMod from "react-grid-layout";
const ResponsiveGridLayout = RGLMod.WidthProvider(RGLMod.Responsive || Responsive);

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get(`/notes?page=${page}&limit=20`);
        console.log("Fetched items:", res.data);
        setItems(res.data.notes);
        setTotalPages(res.data.totalPages);
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
  }, [page]);


  const handleDragEnd = () => {};
  const todos = items.filter(item => item.type === 'todo');
  const notes = items.filter(item => item.type === 'note');

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10">
        <Navbar />
        {isRateLimited && <RateLimitedUI />}

        <div className="mx-auto p-4 mt-2 max-w-[1400px]">
          {loading && (
            <div className="flex justify-center items-center py-20">
               <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
          )}

          {!loading && items.length === 0 && !isRateLimited && <NotesNotFound />}


          {!loading && items.length > 0 && !isRateLimited && (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="space-y-12">

                {/* Todos Section */}
                {todos.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-6 pb-2 border-b border-base-300">
                      <ListTodoIcon className="size-6 text-secondary" />
                      <h2 className="text-2xl font-bold text-base-content">To-Do Lists</h2>
                      <span className="badge badge-secondary badge-sm ml-2">{todos.length}</span>
                    </div>
                    <Droppable droppableId="todos" direction="horizontal">
                      {(provided) => (
                        <div
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {todos.map((todo, index) => (
                            <Draggable key={todo._id} draggableId={todo._id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`relative group ${snapshot.isDragging ? 'z-50' : ''}`}
                                  style={{...provided.draggableProps.style}}
                                >
                                  <div
                                    {...provided.dragHandleProps}
                                    className="absolute -top-3 -right-3 z-10 p-2 bg-base-200 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing border border-base-300 hidden md:block"
                                    title="Drag to reorder"
                                  >
                                    <GripHorizontalIcon className="size-4 text-base-content/70" />
                                  </div>
                                  <TodoCard note={todo} setNotes={setItems} />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
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
                    <Droppable droppableId="notes" direction="horizontal">
                      {(provided) => (
                        <div
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {notes.map((note, index) => (
                            <Draggable key={note._id} draggableId={note._id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`relative group ${snapshot.isDragging ? 'z-50' : ''}`}
                                  style={{...provided.draggableProps.style}}
                                >
                                  <div
                                    {...provided.dragHandleProps}
                                    className="absolute -top-3 -right-3 z-10 p-2 bg-base-200 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing border border-base-300 hidden md:block"
                                    title="Drag to reorder"
                                  >
                                    <GripHorizontalIcon className="size-4 text-base-content/70" />
                                  </div>
                                  <NoteCard note={note} setNotes={setItems} />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </section>
                )}

              </div>
                <div className="flex justify-center items-center gap-4 mt-8 pb-8">
                  <button
                    className="btn btn-primary"
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  <span className="text-base-content font-medium">Page {page} of {totalPages || 1}</span>
                  <button
                    className="btn btn-primary"
                    disabled={page === totalPages || items.length === 0}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>

            </DragDropContext>
          )}
        </div>
      </div>
    </div>
  );
};
export default HomePage;
