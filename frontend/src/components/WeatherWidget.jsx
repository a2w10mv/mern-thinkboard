import { useState, useEffect } from "react";
import { CloudIcon, SunIcon, CloudRainIcon, MapPinIcon, LoaderIcon } from "lucide-react";

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Local");

  useEffect(() => {
    let isMounted = true;

    const fetchWeather = async (lat, lon) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();

        if (isMounted) setWeather(data.current_weather);

        // Try to get location name using reverse geocoding
        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const geoData = await geoRes.json();
          if (isMounted && geoData.address) {
            setLocationName(geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county || "Local");
          }
        } catch {
          // Silent fallback to "Local" if reverse geocoding fails
          console.warn("Could not fetch location name");
        }
      } catch (err) {
        console.error("Failed to fetch weather", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (isMounted) fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Default to London if denied/failed
          if (isMounted) {
            fetchWeather(51.5074, -0.1278);
            setLocationName("London (Default)");
          }
        },
        { timeout: 5000 } // Add timeout to prevent hanging
      );
    } else {
      if (isMounted) {
        fetchWeather(51.5074, -0.1278);
        setLocationName("London (Default)");
      }
    }

    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-md border border-base-300 h-full w-full flex flex-col items-center justify-center p-4">
        <LoaderIcon className="size-6 text-info animate-spin mb-2" />
        <span className="text-xs text-base-content/60 font-medium">Fetching weather...</span>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="card bg-base-100 shadow-md border border-base-300 h-full w-full flex items-center justify-center p-4 text-center">
        <p className="text-xs text-error font-medium">Weather unavailable</p>
      </div>
    );
  }

  // Very basic weather code mapping
  const isRain = weather.weathercode >= 51 && weather.weathercode <= 67;
  const isCloudy = weather.weathercode >= 1 && weather.weathercode <= 3;

  let WeatherIcon = SunIcon;
  let weatherText = "Sunny";
  let iconClass = "text-warning"; // Sun is yellow/orange

  if (isRain) {
    WeatherIcon = CloudRainIcon;
    weatherText = "Rainy";
    iconClass = "text-info";
  } else if (isCloudy) {
    WeatherIcon = CloudIcon;
    weatherText = "Cloudy";
    iconClass = "text-base-content/60";
  }

  return (
    <div className="card bg-base-100 shadow-md border border-base-300 border-t-4 border-t-info h-full w-full flex flex-col p-4 group hover:shadow-lg transition-shadow relative overflow-hidden">
      <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
        <WeatherIcon className={`size-16 ${iconClass}`} />
      </div>
      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col">
          <WeatherIcon className={`size-8 ${iconClass} mb-2 drop-shadow-sm`} />
          <span className="text-xs font-bold text-base-content/70 uppercase tracking-wider">{weatherText}</span>
        </div>
        <div className="text-4xl font-bold text-base-content tracking-tighter drop-shadow-sm">
          {Math.round(weather.temperature)}°
        </div>
      </div>
      <div className="mt-auto pt-3 flex items-center gap-1.5 text-xs font-medium text-base-content/60 border-t border-base-200/50 relative z-10">
        <MapPinIcon className="size-3.5 text-info" />
        <span className="truncate group-hover:text-base-content transition-colors">{locationName}</span>
      </div>
    </div>
  );
};

export default WeatherWidget;
