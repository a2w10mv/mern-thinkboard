import { useState, useEffect } from "react";
import { PlayIcon, SquareIcon, RotateCcwIcon, TimerIcon } from "lucide-react";

const TimerWidget = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => setTime((t) => t + 10), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = Math.floor((time % 1000) / 10);

  return (
    <div className="card bg-base-100 shadow-md border border-base-300 border-t-4 border-t-accent h-full w-full flex flex-col p-4 group hover:shadow-lg transition-shadow relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
        <TimerIcon className="size-8 text-accent" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center relative z-10 py-2">
        <div className="text-3xl sm:text-4xl font-mono font-bold text-accent tracking-tight flex items-baseline">
          {hours > 0 && <span className="mr-1">{hours.toString().padStart(2, '0')}:</span>}
          <span>{minutes.toString().padStart(2, '0')}:</span>
          <span>{seconds.toString().padStart(2, '0')}</span>
          <span className="text-lg sm:text-xl text-accent/60 ml-1 font-normal">.{milliseconds.toString().padStart(2, '0')}</span>
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-auto pt-3 border-t border-base-200/50">
        <button
          className={`btn btn-sm btn-circle shadow-sm ${isRunning ? 'btn-error hover:btn-error' : 'btn-accent hover:btn-accent'}`}
          onClick={() => setIsRunning(!isRunning)}
          title={isRunning ? "Stop" : "Start"}
        >
          {isRunning ?
            <SquareIcon className="size-4" fill="currentColor" /> :
            <PlayIcon className="size-4 ml-0.5" fill="currentColor" />
          }
        </button>
        <button
          className="btn btn-sm btn-circle btn-ghost bg-base-200 hover:bg-base-300 text-base-content/70 hover:text-base-content"
          onClick={() => { setIsRunning(false); setTime(0); }}
          title="Reset"
          disabled={time === 0 && !isRunning}
        >
          <RotateCcwIcon className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default TimerWidget;
