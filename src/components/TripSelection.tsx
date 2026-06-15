import React, { useState } from "react";
import { Plus, Trash, Calendar, MapPin, Sparkles, RefreshCcw } from "lucide-react";
import { Trip } from "../types";

interface TripSelectionProps {
  trips: Trip[];
  activeTripId: string | null;
  onSelectTrip: (id: string) => void;
  onCreateTrip: (tripData: Omit<Trip, "id" | "createdAt" | "updatedAt">) => void;
  onDeleteTrip: (id: string) => void;
  onResetToDefault: () => void;
}

export default function TripSelection({
  trips,
  activeTripId,
  onSelectTrip,
  onCreateTrip,
  onDeleteTrip,
  onResetToDefault,
}: TripSelectionProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("2026-06-18");
  const [endDate, setEndDate] = useState("2026-06-21");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !startDate || !endDate) return;

    // Build the initial schedule mapping dates between start data and end date
    const schedule: { [date: string]: any[] } = {};
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split("T")[0];
      schedule[dateString] = [];
    }

    onCreateTrip({
      title: title.trim(),
      location: location.trim(),
      startDate,
      endDate,
      description: description.trim(),
      schedule,
    });

    // Reset Form
    setTitle("");
    setLocation("");
    setDescription("");
    setShowCreateForm(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm" id="trip-selection-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
            <Calendar className="w-5 h-5 text-sky-500" />
            <span>我的旅行日程計畫</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            記錄、安排、多機同步，與預先通知提醒
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetToDefault}
            className="flex items-center space-x-1 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-semibold py-2 px-3 rounded-xl transition"
            title="還原為原始的澎湖四天三夜範本行程"
            id="reset-to-default-btn"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>還原範本</span>
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center space-x-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-sm transition"
            id="toggle-create-trip-btn"
          >
            <Plus className="w-4 h-4" />
            <span>新增行程</span>
          </button>
        </div>
      </div>

      {showCreateForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 mb-5 relative" id="create-trip-form">
          <h3 className="text-xs font-extrabold text-slate-700 mb-3 flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>規劃全新旅遊計畫</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">行程標題</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：蘭嶼放空五日遊"
                className="w-full text-xs border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 p-2.5 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">目的地城市</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="例如：蘭嶼、台北、東京"
                className="w-full text-xs border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 p-2.5 rounded-lg bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">開始日期</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 p-2.5 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">結束日期</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 p-2.5 rounded-lg bg-white"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">計畫註記/伴侶描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例如：兩位大人自由行，主要是吃海鮮、租借機車等小叮嚀。"
              rows={2}
              className="w-full text-xs border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 p-2.5 rounded-lg bg-white resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold px-3 py-2"
            >
              取消
            </button>
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold py-2 px-4 rounded-lg shadow"
            >
              建立計畫
            </button>
          </div>
        </form>
      )}

      {/* Grid of trip lists */}
      {trips.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-medium">還沒有任何旅遊行程，點擊上方 [新增行程] 開始規劃！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5" id="trips-grid-list">
          {trips.map((t) => {
            const isActive = t.id === activeTripId;
            const daysCount = Object.keys(t.schedule).length;
            const tasksCount = Object.values(t.schedule).flat().length;

            return (
              <div
                key={t.id}
                className={`group border rounded-2xl p-4 cursor-pointer relative transition flex flex-col justify-between ${
                  isActive
                    ? "bg-sky-50/40 border-sky-400/90 ring-1 ring-sky-400 shadow-sm"
                    : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm shadow-xs"
                }`}
                onClick={() => onSelectTrip(t.id)}
              >
                <div>
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-sky-200/50">
                      <MapPin className="w-3 h-3" />
                      <span>{t.location}</span>
                    </span>

                    {/* Delete button (except default standard template for safety) */}
                    {t.id !== "penghu-4d3n-standard" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`確認要刪除 [${t.title}] 這項行程表嗎？`)) {
                            onDeleteTrip(t.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-50 rounded-md text-slate-400 hover:text-rose-600 transition"
                        title="刪除此計畫"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <h3 className="text-xs font-black text-slate-800 mt-2.5 tracking-tight line-clamp-1">
                    {t.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {t.description || "暫無詳細行程備註說明。"}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100/60 flex items-center justify-between text-[11px] text-slate-400 font-semibold select-none">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-300" />
                    <span>
                      {t.startDate.substring(5)} ~ {t.endDate.substring(5)}
                    </span>
                  </span>
                  <span>
                    {daysCount} 天 ({tasksCount} 個活動)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
