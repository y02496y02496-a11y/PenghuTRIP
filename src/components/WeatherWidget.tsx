import React, { useState, useEffect } from "react";
import { CloudRain, Sun, Cloud, CloudSnow, Wind, Droplets, RefreshCw, Sparkles, MapPin } from "lucide-react";
import { WeatherData } from "../types";

interface WeatherWidgetProps {
  initialLocation: string;
}

export default function WeatherWidget({ initialLocation }: WeatherWidgetProps) {
  const [location, setLocation] = useState(initialLocation);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialLocation);

  const fetchWeather = async (targetLoc: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: targetLoc }),
      });
      if (!response.ok) {
        throw new Error("無法連接天氣 API");
      }
      const data = await response.json();
      setWeather(data);
      setLocation(targetLoc);
    } catch (err: any) {
      console.error(err);
      setError("獲取天氣數據失敗，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(initialLocation);
    setSearchQuery(initialLocation);
  }, [initialLocation]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeather(searchQuery.trim());
    }
  };

  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes("雨") || cond.includes("rain") || cond.includes("落水")) {
      return <CloudRain className="w-10 h-10 text-sky-400" />;
    } else if (cond.includes("晴") || cond.includes("sun") || cond.includes("朗")) {
      return <Sun className="w-10 h-10 text-amber-500 animate-spin-slow" />;
    } else if (cond.includes("陰") || cond.includes("雲") || cond.includes("cloud") || cond.includes("霧")) {
      return <Cloud className="w-10 h-10 text-slate-400" />;
    } else if (cond.includes("雪") || cond.includes("snow")) {
      return <CloudSnow className="w-10 h-10 text-blue-200" />;
    }
    return <Cloud className="w-10 h-10 text-slate-400" />;
  };

  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-50/50 rounded-2xl border border-sky-100 p-5 shadow-sm" id="weather-widget-container">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-sky-600" />
          <h3 className="text-sm font-bold text-slate-700">當前目的地天氣</h3>
        </div>
        <form onSubmit={handleSearch} className="flex items-center gap-1.5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="地名（如：澎湖）"
            className="text-xs border border-sky-200 focus:outline-none focus:ring-1 focus:ring-sky-400 py-1.5 px-2.5 rounded-lg bg-white placeholder-slate-400 text-slate-700 w-32"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-500 hover:bg-sky-600 font-medium text-white px-2.5 py-1.5 rounded-lg text-xs leading-none transition"
          >
            查詢
          </button>
        </form>
      </div>

      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center space-y-2">
          <RefreshCw className="w-6 h-6 text-sky-500 animate-spin" />
          <p className="text-xs text-slate-400">正在分析最新氣象與雷達圖...</p>
        </div>
      ) : error ? (
        <div className="py-6 text-center">
          <p className="text-xs text-rose-500 mb-2">{error}</p>
          <button
            onClick={() => fetchWeather(location)}
            className="inline-flex items-center space-x-1 text-xs text-sky-600 font-medium hover:underline bg-sky-100/60 px-2 py-1 rounded"
          >
            <RefreshCw className="w-3 h-3" />
            <span>重新載入</span>
          </button>
        </div>
      ) : weather ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-700">{location}</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">即時觀測數據</div>
            </div>
            <button
              onClick={() => fetchWeather(location)}
              className="p-1 text-sky-600 hover:bg-sky-100/50 rounded-lg transition"
              title="刷新天氣"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-sky-100/50">
            {getWeatherIcon(weather.condition)}
            <div className="flex-1">
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-black text-slate-800 tracking-tight">{weather.temperature}</span>
                <span className="text-xs font-bold text-sky-600 px-1.5 py-0.5 bg-sky-50 rounded">{weather.condition}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{weather.description}</p>
            </div>
          </div>

          {/* Wind & Humidity Details */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white/60 p-2.5 rounded-xl border border-sky-100/30 flex items-center space-x-2">
              <Wind className="w-4 h-4 text-sky-500" />
              <div>
                <div className="text-[9px] text-slate-400 font-semibold uppercase">風向風速</div>
                <div className="text-xs text-slate-700 font-medium truncate">{weather.wind || "東風、3米/秒"}</div>
              </div>
            </div>
            <div className="bg-white/60 p-2.5 rounded-xl border border-sky-100/30 flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-sky-500" />
              <div>
                <div className="text-[9px] text-slate-400 font-semibold uppercase">空氣濕度</div>
                <div className="text-xs text-slate-700 font-medium truncate">{weather.humidity || "72%"}</div>
              </div>
            </div>
          </div>

          {/* Dynamic AI travel suggestions */}
          <div className="bg-white/90 p-3 rounded-xl border border-sky-100 shadow-sm">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-sky-700 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>當日戶外出行指數</span>
            </div>
            <ul className="space-y-1.5">
              {weather.tips.map((tip, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-start space-x-1.5 leading-relaxed">
                  <span className="text-sky-400 font-black mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
