import { Link, useNavigate } from "react-router";
import { PlusIcon, Palette, LogOut } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

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

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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

            {user && (
              <>
                <Link to={"/create"} className="btn btn-primary">
                  <PlusIcon className="size-5" />
                  <span className="hidden sm:inline">New Note</span>
                </Link>
                <div className="dropdown dropdown-end">
                   <div tabIndex={0} role="button" className="btn btn-ghost avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-10">
                        <span className="text-xs">{user.username.substring(0,2).toUpperCase()}</span>
                      </div>
                   </div>
                   <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-300 rounded-box w-52">
                     <li className="px-4 py-2 font-bold opacity-50 border-b border-base-content/10">Hello, {user.username}</li>
                     <li><button onClick={handleLogout} className="text-error mt-1"><LogOut className="size-4" /> Logout</button></li>
                   </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
