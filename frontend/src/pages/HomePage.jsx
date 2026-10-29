import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
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
import { FileTextIcon, ListTodoIcon, GripHorizontalIcon, LayoutGridIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

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

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    // Create copies of the items to update state optimistically
    const newItems = Array.from(items);

    if (type === "todos" || source.droppableId === "todos") {
      const todoItems = newItems.filter(item => item.type === "todo");
      const nonTodoItems = newItems.filter(item => item.type !== "todo");

      const [movedTodo] = todoItems.splice(source.index, 1);
      todoItems.splice(destination.index, 0, movedTodo);

      setItems([...todoItems, ...nonTodoItems]);
    } else if (type === "notes" || source.droppableId === "notes") {
      const noteItems = newItems.filter(item => item.type === "note");
      const nonNoteItems = newItems.filter(item => item.type !== "note");

      const [movedNote] = noteItems.splice(source.index, 1);
      noteItems.splice(destination.index, 0, movedNote);

      setItems([...nonNoteItems, ...noteItems]);
    }
  };

  const todos = items.filter(item => item.type === 'todo');
  const notes = items.filter(item => item.type === 'note');

  return (
    <div className="min-h-screen relative bg-base-200/50">
      <div className="relative z-10">
        <Navbar />
        {isRateLimited && <RateLimitedUI />}

        <div className="mx-auto p-4 md:p-6 lg:p-8 mt-2 max-w-[1400px]">
          {loading && (
            <div className="flex flex-col justify-center items-center py-32 gap-4">
               <span className="loading loading-spinner text-primary loading-lg"></span>
               <p className="text-base-content/60 font-medium animate-pulse">Loading your dashboard...</p>
            </div>
          )}

          {!loading && items.length === 0 && !isRateLimited && <NotesNotFound />}

          {!loading && items.length > 0 && !isRateLimited && (
            <DragDropContext onDragEnd={handleDragEnd}>
              {/* Widgets Section */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 mt-4">
                <div className="h-32 transform hover:-translate-y-1 transition-transform duration-300">
                  <TimeWidget />
                </div>
                <div className="h-32 transform hover:-translate-y-1 transition-transform duration-300">
                  <WeatherWidget />
                </div>
                <div className="h-32 transform hover:-translate-y-1 transition-transform duration-300">
                  <TimerWidget />
                </div>
                <div className="h-32 transform hover:-translate-y-1 transition-transform duration-300 hidden sm:block">
                  <MascotWidget />
                </div>
              </div>

              <div className="space-y-14">
                {/* Todos Section */}
                {todos.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-base-300/50">
                      <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                        <ListTodoIcon className="size-6" />
                      </div>
                      <h2 className="text-2xl font-bold text-base-content tracking-tight">To-Do Lists</h2>
                      <span className="badge badge-secondary badge-sm ml-2 font-bold">{todos.length}</span>
                    </div>
                    <Droppable droppableId="todos" direction="horizontal" type="todos">
                      {(provided) => (
                        <div
                          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {todos.map((todo, index) => (
                            <Draggable key={todo._id} draggableId={todo._id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`relative group ${snapshot.isDragging ? 'z-50 scale-105' : 'hover:-translate-y-1'} transition-all duration-200`}
                                  style={{...provided.draggableProps.style}}
                                >
                                  <div
                                    {...provided.dragHandleProps}
                                    className="absolute -top-3 -right-3 z-10 p-2 bg-base-100 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all cursor-grab active:cursor-grabbing border border-base-300 hidden md:block hover:bg-base-200 hover:scale-110"
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
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-base-300/50">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <FileTextIcon className="size-6" />
                      </div>
                      <h2 className="text-2xl font-bold text-base-content tracking-tight">Notes</h2>
                      <span className="badge badge-primary badge-sm ml-2 font-bold">{notes.length}</span>
                    </div>
                    <Droppable droppableId="notes" direction="horizontal" type="notes">
                      {(provided) => (
                        <div
                          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {notes.map((note, index) => (
                            <Draggable key={note._id} draggableId={note._id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`relative group ${snapshot.isDragging ? 'z-50 scale-105' : 'hover:-translate-y-1'} transition-all duration-200`}
                                  style={{...provided.draggableProps.style}}
                                >
                                  <div
                                    {...provided.dragHandleProps}
                                    className="absolute -top-3 -right-3 z-10 p-2 bg-base-100 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all cursor-grab active:cursor-grabbing border border-base-300 hidden md:block hover:bg-base-200 hover:scale-110"
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12 pb-8">
                  <div className="join shadow-md border border-base-200">
                    <button
                      className="join-item btn btn-sm hover:bg-base-300"
                      disabled={page === 1}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                      <ChevronLeftIcon className="size-4" />
                      Prev
                    </button>
                    <button className="join-item btn btn-sm no-animation bg-base-100 hover:bg-base-100 font-medium">
                      Page {page} of {totalPages}
                    </button>
                    <button
                      className="join-item btn btn-sm hover:bg-base-300"
                      disabled={page === totalPages || items.length === 0}
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    >
                      Next
                      <ChevronRightIcon className="size-4" />
                    </button>
                  </div>
                </div>
              )}

            </DragDropContext>
          )}
        </div>
      </div>
    </div>
  );
};
export default HomePage;
