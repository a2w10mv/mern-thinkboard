import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import SnowfallBackground from "./components/SnowfallBackground";
import FireworksBackground from "./components/FireworksBackground";

const App = () => {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  const isSnowfall = month === 11 && day >= 1 && day <= 25;
  const isFireworks = (month === 11 && day >= 26) || month === 0;

  return (
    <div className="relative h-full w-full">
      {isSnowfall && <SnowfallBackground />}
      {isFireworks && <FireworksBackground />}
      <div className="absolute inset-0 -z-10 h-full items-center px-5 py-24" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
      </Routes>
    </div>
  );
};

export default App;
