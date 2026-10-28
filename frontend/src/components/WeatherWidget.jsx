import { useState, useEffect } from "react";
import { CloudIcon, SunIcon, CloudRainIcon, MapPinIcon } from "lucide-react";

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        setWeather(data.current_weather);
      } catch (err) {
        console.error("Failed to fetch weather", err);
      } finally {
        setLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Default to London if denied/failed
          fetchWeather(51.5074, -0.1278);
        }
      );
    } else {
      fetchWeather(51.5074, -0.1278);
    }
  }, []);

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-md border border-base-300 h-full w-full flex items-center justify-center">
        <span className="loading loading-dots loading-sm text-info"></span>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="card bg-base-100 shadow-md border border-base-300 h-full w-full flex items-center justify-center p-4 text-center">
        <p className="text-xs text-error">Weather unavailable</p>
      </div>
    );
  }

  // Very basic weather code mapping
  const isRain = weather.weathercode >= 51 && weather.weathercode <= 67;
  const isCloudy = weather.weathercode >= 1 && weather.weathercode <= 3;
  const WeatherIcon = isRain ? CloudRainIcon : (isCloudy ? CloudIcon : SunIcon);

  return (
    <div className="card bg-base-100 shadow-md border border-base-300 border-t-4 border-t-info h-full w-full flex flex-col p-4">
      <div className="flex justify-between items-start">
        <WeatherIcon className="size-8 text-info" />
        <div className="text-3xl font-bold text-base-content">{Math.round(weather.temperature)}°</div>
      </div>
      <div className="mt-auto pt-2 flex items-center gap-1 text-xs text-base-content/60">
        <MapPinIcon className="size-3" />
        <span className="truncate">Local</span>
      </div>
    </div>
  );
};

export default WeatherWidget;
