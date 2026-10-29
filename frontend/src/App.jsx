import { Routes, Route } from "react-router";
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("./pages/HomePage"));
const CreatePage = lazy(() => import("./pages/CreatePage"));
const NoteDetailPage = lazy(() => import("./pages/NoteDetailPage"));
const SnowfallBackground = lazy(() => import("./components/SnowfallBackground"));
const FireworksBackground = lazy(() => import("./components/FireworksBackground"));

const App = () => {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  const isSnowfall = month === 11 && day >= 1 && day <= 25;
  const isFireworks = (month === 11 && day >= 26) || month === 0;

  return (
    <div className="relative h-full w-full">
      <Suspense fallback={null}>
        {isSnowfall && <SnowfallBackground />}
        {isFireworks && <FireworksBackground />}
      </Suspense>
      <div className="absolute inset-0 -z-10 h-full items-center px-5 py-24" />
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner text-primary loading-lg"></span>
        </div>
      }>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/note/:id" element={<NoteDetailPage />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
