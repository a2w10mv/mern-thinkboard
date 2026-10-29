import { useState, useEffect } from "react";
import { ClockIcon, CalendarIcon } from "lucide-react";

const TimeWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="card bg-base-100 shadow-md border border-base-300 h-full w-full overflow-hidden flex flex-col p-4 group hover:shadow-lg transition-shadow relative">
      <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-40 transition-opacity">
        <ClockIcon className="size-8 text-primary" />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="text-4xl sm:text-5xl font-bold font-mono text-primary tracking-tight mb-2 relative z-10 drop-shadow-sm">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          <span className="text-xl sm:text-2xl text-primary/60 ml-1 font-normal animate-pulse">
            {time.getSeconds() % 2 === 0 ? ':' : ' '}
            {time.getSeconds().toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-auto pt-3 border-t border-base-200/50">
        <CalendarIcon className="size-3.5 text-base-content/50" />
        <div className="text-xs text-base-content/70 font-medium uppercase tracking-widest">
          {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
};

export default TimeWidget;
