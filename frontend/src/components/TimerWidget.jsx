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
    <div className="card bg-base-100 shadow-md border border-base-300 border-t-4 border-t-accent h-full w-full flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-2 right-2 opacity-50">
        <TimerIcon className="size-4" />
      </div>
      <div className="text-3xl font-mono font-bold text-accent mb-4">
        {hours > 0 && `${hours.toString().padStart(2, '0')}:`}
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}.
        <span className="text-xl">{milliseconds.toString().padStart(2, '0')}</span>
      </div>
      <div className="flex gap-2">
        <button
          className={`btn btn-sm btn-circle ${isRunning ? 'btn-error' : 'btn-accent'}`}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? <SquareIcon className="size-4" fill="currentColor" /> : <PlayIcon className="size-4" fill="currentColor" />}
        </button>
        <button
          className="btn btn-sm btn-circle btn-ghost bg-base-200"
          onClick={() => { setIsRunning(false); setTime(0); }}
        >
          <RotateCcwIcon className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default TimerWidget;
