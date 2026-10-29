import { NotebookIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router";

const NotesNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6 max-w-md mx-auto text-center">
      <div className="bg-primary/10 rounded-full p-8 mb-4 relative">
        <NotebookIcon className="size-16 text-primary" />
        <div className="absolute top-4 right-4 bg-base-100 rounded-full p-1 shadow-sm">
          <PlusIcon className="size-4 text-secondary" />
        </div>
      </div>
      <h3 className="text-3xl font-bold text-base-content">No items yet</h3>
      <p className="text-base-content/70 leading-relaxed max-w-sm">
        Ready to organize your thoughts and tasks? Create your first note or to-do list to get started on your journey.
      </p>
      <Link to="/create" className="btn btn-primary mt-4 px-8">
        <PlusIcon className="size-5 mr-1" />
        Create Your First Item
      </Link>
    </div>
  );
};

export default NotesNotFound;
