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
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-3xl font-bold text-primary font-mono tracking-tight hover:opacity-80 transition-opacity">
            asdfghjkl
          </Link>
          <div className="flex items-center gap-4">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn m-1">
                <Palette className="size-5" />
                <span className="hidden sm:inline">Theme</span>
              </div>
              <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl h-64 overflow-y-auto">
                {themes.map((t) => (
                  <li key={t}>
                    <button
                      className={`btn btn-sm btn-ghost w-full justify-start capitalize ${theme === t ? "text-primary" : ""}`}
                      onClick={() => setTheme(t)}
                    >
                      {t}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <Link to={"/create"} className="btn btn-primary">
              <PlusIcon className="size-5" />
              <span className="hidden sm:inline">New Note</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
