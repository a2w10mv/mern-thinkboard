import { useState, lazy, Suspense } from "react";
import { SmileIcon } from "lucide-react";

// Lazy load the 3D components
const LazyMascotScene = lazy(() => import("./MascotScene"));

const MascotWidget = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [load3D, setLoad3D] = useState(false);

  return (
    <div
      className="card bg-base-100 shadow-md border border-base-300 h-full w-full overflow-hidden relative cursor-pointer"
      onMouseEnter={() => {
        setIsHovered(true);
        if (!load3D) setLoad3D(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (!load3D) setLoad3D(true);
      }}
    >
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-base-100/80 p-1 rounded backdrop-blur-sm">
        <SmileIcon className="size-4 text-warning" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/70">Mascot</span>
      </div>

      {!load3D && (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-base-200/50">
          <div className="text-center">
            <SmileIcon className={`size-12 mx-auto text-warning transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
            <p className="text-xs mt-2 text-base-content/60 font-medium">Hover/Click to wake me up</p>
          </div>
        </div>
      )}

      {load3D && (
        <div className="absolute inset-0 z-0">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full w-full bg-base-200/50">
              <span className="loading loading-spinner loading-md text-warning"></span>
            </div>
          }>
            <LazyMascotScene />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default MascotWidget;
