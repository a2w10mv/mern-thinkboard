import { Link } from "react-router";
import { PlusIcon, Palette } from "lucide-react";
import { useEffect, useState } from "react";

const themes = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
  "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
  "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
  "night", "coffee", "winter", "dim", "nord", "sunset"
];

const Navbar = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "sunset"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header className="bg-base-100 border-b border-base-200 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-opacity-90 transition-all duration-300">
      <div className="mx-auto max-w-[1400px] px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 text-primary p-2 rounded-lg group-hover:bg-primary group-hover:text-primary-content transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/></svg>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary hidden sm:block">
              ThinkBoard
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm h-10 px-3 bg-base-200/50 hover:bg-base-200 border border-base-200">
                <Palette className="size-4 text-base-content/70" />
                <span className="hidden md:inline text-sm font-medium text-base-content/70 capitalize">{theme}</span>
              </div>
              <ul tabIndex={0} className="dropdown-content bg-base-100 rounded-box z-[1] w-56 p-2 shadow-xl border border-base-200 h-64 overflow-y-auto mt-2 custom-scrollbar">
                <div className="text-xs font-bold text-base-content/50 uppercase tracking-wider px-2 pt-2 pb-3 sticky top-0 bg-base-100 z-10 border-b border-base-200/50 mb-2">
                  Select Theme
                </div>
                {themes.map((t) => (
                  <li key={t}>
                    <button
                      className={`btn btn-sm btn-ghost w-full justify-start capitalize text-sm font-medium mb-1 ${theme === t ? "bg-primary/10 text-primary hover:bg-primary/20" : "hover:bg-base-200"}`}
                      onClick={() => {
                        setTheme(t);
                        const elem = document.activeElement;
                        if (elem) {
                          elem?.blur();
                        }
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{t}</span>
                        {theme === t && (
                          <div className="size-2 rounded-full bg-primary"></div>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <Link to={"/create"} className="btn btn-primary btn-sm h-10 shadow-sm hover:shadow-md transition-shadow">
              <PlusIcon className="size-4" />
              <span className="hidden sm:inline font-medium">New Item</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
