import { useEffect, useState } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import api from "../lib/axios";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import toast from "react-hot-toast";

import NoteCard from "../components/NoteCard";
import TodoCard from "../components/TodoCard";
import TimeWidget from "../components/TimeWidget";
import WeatherWidget from "../components/WeatherWidget";
import TimerWidget from "../components/TimerWidget";
import MascotWidget from "../components/MascotWidget";

import NotesNotFound from "../components/NotesNotFound";
import SnowfallBackground from "../components/SnowfallBackground";
import FireworksBackground from "../components/FireworksBackground";
import { LayoutGridIcon } from "lucide-react";

// For vite/rollup compatibility with react-grid-layout
import { Responsive } from "react-grid-layout";
import * as RGLMod from "react-grid-layout";
const ResponsiveGridLayout = RGLMod.WidthProvider(RGLMod.Responsive || Responsive);

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        let res = await api.get("/notes");

        // Auto-seed missing bento widgets if they don't exist
        const types = res.data.map(i => i.type);
        const hasTime = types.includes('time');
        const hasWeather = types.includes('weather');
        const hasTimer = types.includes('timer');
        const hasMascot = types.includes('mascot');

        if (!hasTime || !hasWeather || !hasTimer || !hasMascot) {
            console.log("Seeding missing widgets...");
            await api.post("/notes/seed");
            res = await api.get("/notes"); // Re-fetch
        }

        setItems(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching items", error);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load dashboard items");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleLayoutChange = async (currentLayout) => {
    if (loading) return; // Prevent saving empty layout during load

    // Create bulk update payload
    const updates = currentLayout.map(l => {
      return {
        id: l.i,
        layout: { x: l.x, y: l.y, w: l.w, h: l.h }
      }
    });

    // Update local state layout to prevent jumping
    setItems(prev => prev.map(item => {
        const update = updates.find(u => u.id === item._id);
        if (update) {
            return { ...item, layout: update.layout };
        }
        return item;
    }));

    try {
      await api.put('/notes/reorder', { updates });
    } catch (error) {
      console.error('Failed to save layout:', error);
      toast.error('Failed to save dashboard layout');
    }
  };

  const renderItem = (item) => {
    let content = null;
    const type = item.type || 'note';

    switch (type) {
        case 'note':
            content = <NoteCard note={item} setNotes={setItems} />;
            break;
        case 'todo':
            content = <TodoCard note={item} setNotes={setItems} />;
            break;
        case 'time':
            content = <TimeWidget />;
            break;
        case 'weather':
            content = <WeatherWidget />;
            break;
        case 'timer':
            content = <TimerWidget />;
            break;
        case 'mascot':
            content = <MascotWidget />;
            break;
        default:
            content = <div className="p-4 bg-error text-error-content rounded">Unknown Widget Type</div>;
    }

    return (
        <div key={item._id} className="h-full w-full group relative">
             {/* Drag Handle for all items */}
             <div className="absolute top-2 right-2 z-50 p-1.5 bg-base-200/80 backdrop-blur rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing border border-base-300 widget-drag-handle">
                <LayoutGridIcon className="size-4 text-base-content/70" />
            </div>
            {content}
        </div>
    );
  };

  const layout = items.map(item => {
      const l = item.layout || { x: 0, y: Infinity, w: 2, h: 2 };
      return {
          i: item._id,
          x: l.x,
          y: l.y,
          w: l.w,
          h: l.h,
          minW: 1,
          minH: 1
      };
  });

  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  const isSnowfall = month === 11 && day >= 1 && day <= 25;
  const isFireworks = (month === 11 && day >= 26) || month === 0;

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10">
        <Navbar />
        {isRateLimited && <RateLimitedUI />}

        <div className="mx-auto p-4 mt-2 max-w-[1400px]">
          {loading && (
            <div className="flex justify-center items-center py-20">
               <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
          )}

          {!loading && items.length === 0 && !isRateLimited && <NotesNotFound />}

          {isSnowfall && <SnowfallBackground />}
          {isFireworks && <FireworksBackground />}

          {!loading && items.length > 0 && !isRateLimited && (
            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 6, md: 4, sm: 2, xs: 1, xxs: 1 }}
                rowHeight={100}
                onLayoutChange={(curr) => handleLayoutChange(curr)}
                draggableHandle=".widget-drag-handle"
                isResizable={true}
                margin={[16, 16]}
            >
                {items.map(item => renderItem(item))}
            </ResponsiveGridLayout>
          )}
        </div>
      </div>
    </div>
  );
};
export default HomePage;
