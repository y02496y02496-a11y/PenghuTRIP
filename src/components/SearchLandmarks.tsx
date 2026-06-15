import React, { useState } from "react";
import { Search, Compass, UtensilsCrossed, Sparkles, MapPin, Plus, Loader, CornerDownRight } from "lucide-react";
import { Landmark } from "../types";

interface SearchLandmarksProps {
  tripLocation: string;
  tripDays: string[]; // YYYY-MM-DD list to let user add to a specific day
  onAddLandmarkToDay: (day: string, landmark: Landmark, time: string) => void;
}

export default function SearchLandmarks({
  tripLocation,
  tripDays,
  onAddLandmarkToDay,
}: SearchLandmarksProps) {
  const [location, setLocation] = useState(tripLocation);
  const [activeType, setActiveType] = useState<"attraction" | "food">("attraction");
  const [keyword, setKeyword] = useState("");
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Scheduling configuration State
  const [addingToDayIdx, setAddingToDayIdx] = useState<number | null>(null); // index of landmark currently being scheduled
  const [selectedDay, setSelectedDay] = useState(tripDays[0] || "");
  const [selectedTime, setSelectedTime] = useState("14:00");

  const searchLandmarks = async () => {
    if (!location.trim()) return;
    setLoading(true);
    setError(null);
    setAddingToDayIdx(null);
    try {
      const response = await fetch("/api/landmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: location.trim(),
          type: activeType,
          keyword: keyword.trim() || undefined,
        }),
      });
      if (!response.ok) {
        throw new Error("無法連接地標 API");
      }
      const data = await response.json();
      setLandmarks(data);
    } catch (err: any) {
      console.error(err);
      setError("獲取地標失敗，請稍後重試。");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchLandmarks();
  };

  const handleAddClick = (idx: number) => {
    setAddingToDayIdx(idx);
    if (tripDays.length > 0 && !selectedDay) {
      setSelectedDay(tripDays[0]);
    }
  };

  const handleConfirmAdd = (landmark: Landmark, index: number) => {
    onAddLandmarkToDay(selectedDay, landmark, selectedTime);
    setAddingToDayIdx(null); // Close the sub-panel
    // Show temporary alert or success trigger
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm" id="search-landmarks-container">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-bold text-slate-800">地標導航 & 本地推薦 (即時搜尋)</h3>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 mb-4">
        <button
          onClick={() => setActiveType("attraction")}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-bold rounded-lg transition ${
            activeType === "attraction" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>景點古蹟</span>
        </button>
        <button
          onClick={() => setActiveType("food")}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-bold rounded-lg transition ${
            activeType === "food" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>在地美食</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSearchSubmit} className="space-y-3 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase">目的地/城市</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="例如：澎湖馬公、西嶼"
              className="w-full text-xs border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 py-2.5 px-3 rounded-xl bg-slate-50 text-slate-700 font-medium"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase">特定關鍵字 (選填)</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="例如：玄武岩、黑糖糕、冰品"
              className="w-full text-xs border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 py-2.5 px-3 rounded-xl bg-slate-50 text-slate-700 font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-900 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-sm transition"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin text-white" />
              <span>正在向旅行達人諮詢中...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>尋找口碑推薦</span>
            </>
          )}
        </button>
      </form>

      {/* Error / Loading / Not Found */}
      {error && <div className="text-xs text-rose-500 text-center py-4 bg-rose-50 rounded-xl">{error}</div>}

      {landmarks.length === 0 && !loading && !error && (
        <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-medium">輸入目的地，一鍵獲取當地景點或特色必吃！</p>
        </div>
      )}

      {/* Landmark list */}
      {landmarks.length > 0 && !loading && (
        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1" id="landmarks-list-scroll">
          {landmarks.map((l, index) => {
            const isAdding = addingToDayIdx === index;
            return (
              <div
                key={index}
                className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 relative group transition hover:border-slate-300 hover:shadow-sm"
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 flex-wrap">
                      <span>{l.name}</span>
                      {l.priceRange && (
                        <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                          {l.priceRange}
                        </span>
                      )}
                    </h4>
                    {l.address && (
                      <p className="text-[10px] text-slate-400 font-medium mt-1 select-none flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-slate-300" />
                        {l.address}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddClick(index)}
                    className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg border border-sky-200 group-hover:bg-white transition flex items-center gap-1"
                    title="新增至行程"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">加入行程</span>
                  </button>
                </div>

                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{l.description}</p>

                {/* AI Review highlight */}
                <div className="bg-sky-50/50 rounded-lg p-2 mt-2 border border-sky-100/30">
                  <div className="text-[10px] font-extrabold text-sky-800">達人特色點評：</div>
                  <p className="text-[11px] text-slate-600 font-medium italic mt-0.5">「{l.highlight}」</p>
                </div>

                {/* Badges tags */}
                {l.tags && l.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {l.tags.map((t, tid) => (
                      <span key={tid} className="text-[9px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Sub-panel for scheduling */}
                {isAdding && (
                  <div className="mt-3.5 pt-3.5 border-t border-slate-200 bg-white p-3 rounded-lg border border-slate-100 flex flex-col gap-3 shadow-inner">
                    <div className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <CornerDownRight className="w-3.5 h-3.5 text-slate-400" />
                      <span>安排時間與日期</span>
                    </div>
                    {tripDays.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 mb-1 uppercase">哪一天？</label>
                          <select
                            value={selectedDay}
                            onChange={(e) => setSelectedDay(e.target.value)}
                            className="w-full text-xs border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 p-2 rounded-lg bg-slate-50 font-medium"
                          >
                            {tripDays.map((d) => (
                              <option key={d} value={d}>
                                {d.substring(5)} {/* show MM-DD */}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 mb-1 uppercase">幾點鐘？</label>
                          <input
                            type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full text-xs border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 p-2 rounded-lg bg-slate-50 font-medium"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-rose-500">當前無有效日程，請先建立行程！</p>
                    )}
                    <div className="flex items-center justify-end gap-1.5 pt-1">
                      <button
                        onClick={() => setAddingToDayIdx(null)}
                        className="text-[10px] text-slate-400 hover:text-slate-600 font-bold px-2 py-1.5"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => handleConfirmAdd(l, index)}
                        className="text-[10px] bg-sky-500 hover:bg-sky-600 text-white font-bold px-3 py-1.5 rounded-lg"
                      >
                        確認加入
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
