import { useState, useEffect } from "react";
import { ClockIcon } from "lucide-react";

const TimeWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="card bg-base-100 shadow-md border border-base-300 h-full w-full overflow-hidden flex flex-col items-center justify-center relative">
      <div className="absolute top-2 right-2 opacity-50">
        <ClockIcon className="size-4" />
      </div>
      <div className="text-4xl font-bold font-mono text-primary tracking-tight">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-sm text-base-content/60 font-medium mt-1 uppercase tracking-widest">
        {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
      </div>
    </div>
  );
};

export default TimeWidget;
