import React, { useState } from "react";
import { Clock, MapPin, CheckSquare, Square, Bell, BellOff, Trash2, Plus, CornerDownRight, Save, Edit, HelpCircle } from "lucide-react";
import { Trip, Task, DaySchedule } from "../types";

interface TripDetailProps {
  trip: Trip;
  onUpdateTrip: (updatedTrip: Trip) => void;
  onTriggerAlarm: (task: Task, tripTitle: string) => void;
}

export default function TripDetail({ trip, onUpdateTrip, onTriggerAlarm }: TripDetailProps) {
  // Extract schedule dates
  const dates = Object.keys(trip.schedule).sort();
  const [activeDate, setActiveDate] = useState<string>(dates[0] || "");

  // Insertion State
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("12:00");
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Editing State
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Ensure active date is valid
  React.useEffect(() => {
    if (dates.length > 0 && (!activeDate || !dates.includes(activeDate))) {
      setActiveDate(dates[0]);
    }
  }, [trip.id]);

  const activeDayIndex = dates.indexOf(activeDate) + 1;
  const currentTasks = trip.schedule[activeDate] || [];

  // Sort tasks by time HH:MM
  const sortedTasks = [...currentTasks].sort((a, b) => a.time.localeCompare(b.time));

  // Stats calculation
  const totalTasksCount = sortedTasks.length;
  const completedTasksCount = sortedTasks.filter((t) => t.completed).length;
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Toggle checkbox
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = currentTasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });

    const updatedTrip: Trip = {
      ...trip,
      schedule: {
        ...trip.schedule,
        [activeDate]: updatedTasks,
      },
      updatedAt: Date.now(),
    };

    onUpdateTrip(updatedTrip);
  };

  // Add Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      time: newTime,
      title: newTitle.trim(),
      location: newLocation.trim(),
      description: newDescription.trim(),
      completed: false,
      reminderEnabled: false,
      reminderMinutesBefore: 0,
    };

    const updatedTrip: Trip = {
      ...trip,
      schedule: {
        ...trip.schedule,
        [activeDate]: [...currentTasks, newTask],
      },
      updatedAt: Date.now(),
    };

    onUpdateTrip(updatedTrip);

    // Reset inserting states
    setNewTitle("");
    setNewTime("12:00");
    setNewLocation("");
    setNewDescription("");
    setShowQuickAdd(false);
  };

  // Trigger Reminder Toggle block
  const handleToggleReminder = (taskId: string, mBefore = 15) => {
    const updatedTasks = currentTasks.map((t) => {
      if (t.id === taskId) {
        const isEnable = !t.reminderEnabled;
        return {
          ...t,
          reminderEnabled: isEnable,
          reminderMinutesBefore: mBefore,
          reminderTriggered: false, // reset triggered flag
        };
      }
      return t;
    });

    const updatedTrip: Trip = {
      ...trip,
      schedule: {
        ...trip.schedule,
        [activeDate]: updatedTasks,
      },
      updatedAt: Date.now(),
    };

    onUpdateTrip(updatedTrip);
  };

  // Delete Task
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = currentTasks.filter((t) => t.id !== taskId);

    const updatedTrip: Trip = {
      ...trip,
      schedule: {
        ...trip.schedule,
        [activeDate]: updatedTasks,
      },
      updatedAt: Date.now(),
    };

    onUpdateTrip(updatedTrip);
  };

  // Start Editing Task
  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditTime(task.time);
    setEditLocation(task.location);
    setEditDescription(task.description);
  };

  // Save Task Changes
  const saveTaskEdit = (taskId: string) => {
    const updatedTasks = currentTasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          title: editTitle.trim(),
          time: editTime,
          location: editLocation.trim(),
          description: editDescription.trim(),
        };
      }
      return t;
    });

    const updatedTrip: Trip = {
      ...trip,
      schedule: {
        ...trip.schedule,
        [activeDate]: updatedTasks,
      },
      updatedAt: Date.now(),
    };

    onUpdateTrip(updatedTrip);
    setEditingTaskId(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm" id="trip-detail-container">
      {/* Date switching Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3 mb-4 scrollbar-hide" id="dates-switcher-tabs">
        {dates.map((d, index) => {
          const isActive = d === activeDate;
          const [yr, mn, dy] = d.split("-");
          return (
            <button
              key={d}
              onClick={() => {
                setActiveDate(d);
                setEditingTaskId(null);
              }}
              className={`py-2 px-4 text-xs font-bold rounded-xl transition ${
                isActive
                  ? "bg-sky-500 text-white shadow-sm"
                  : "bg-slate-100/80 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
              }`}
            >
              Day {index + 1} ({mn}/{dy})
            </button>
          );
        })}
      </div>

      {activeDate && (
        <div>
          {/* Day overview & Completion Progress */}
          <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h3 className="text-xs font-black text-slate-800 flex items-center gap-1">
                <span>第 {activeDayIndex} 天行程表</span>
                <span className="text-slate-400 font-semibold text-[11px]">({activeDate})</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {trip.description ? `${trip.description.substring(0, 45)}...` : "規劃每日必玩事項與打卡景點"}
              </p>
            </div>

            {/* Progress bar */}
            <div className="flex-1 max-w-xs sm:text-right">
              <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-600 mb-1">
                <span>任務完成進度</span>
                <span>
                  {completedTasksCount} / {totalTasksCount} 已打卡 ({completionPercentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick add and adding panel trigger */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-black text-slate-700 tracking-tight">時間軸安排 (依先後排序)</h4>
            <button
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="flex items-center space-x-1 text-sky-600 font-bold text-xs bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition"
              id="show-quick-add-btn"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增活動</span>
            </button>
          </div>

          {showQuickAdd && (
            <form onSubmit={handleAddTask} className="bg-slate-50/50 border border-slate-200/50 rounded-xl p-3 mb-4 space-y-3" id="quick-add-task-form">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <CornerDownRight className="w-3.5 h-3.5 text-slate-400" />
                <span>新增當日活動</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[9px] font-bold text-slate-400 mb-1 uppercase">活動名稱</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="例如：馬公特色仙人掌冰店"
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 mb-1 uppercase">設定時間</label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 mb-1 uppercase">地點/位置 (選填)</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="例如：馬公市中正路"
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 mb-1 uppercase">備忘筆記 (選填)</label>
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="例如：必吃仙人掌千層冰，預算共估200元"
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowQuickAdd(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold px-2 py-1.5"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="text-xs bg-sky-500 hover:bg-sky-600 font-bold text-white px-3.5 py-1.5 rounded-lg shadow-xs"
                >
                  建立活動
                </button>
              </div>
            </form>
          )}

          {/* Chronological timetable timeline display */}
          {sortedTasks.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-100">
              <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-semibold">這一天還沒安排事情。可以直接新增，或由旁邊的「美食地標」直接加入行程！</p>
            </div>
          ) : (
            <div className="relative border-l border-slate-100 pl-4 ml-2.5 pb-4 space-y-4" id="timeline-list">
              {sortedTasks.map((t) => {
                const isEditing = editingTaskId === t.id;
                return (
                  <div key={t.id} className="relative group/item">
                    {/* Time Dot Indicator */}
                    <span className="absolute -left-[24.5px] top-1.5 w-[10px] h-[10px] rounded-full border-2 border-white ring-2 ring-sky-400 bg-sky-400 group-hover/item:scale-125 transition duration-200" />

                    {isEditing ? (
                      /* Inline task editing item card form */
                      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-3 shadow-inner">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                          <div className="sm:col-span-3">
                            <label className="block text-[8px] font-bold text-slate-400 uppercase">活動名稱</label>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full text-xs border border-slate-200 p-2 rounded bg-white text-slate-700 font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold text-slate-400 uppercase">時間</label>
                            <input
                              type="time"
                              value={editTime}
                              onChange={(e) => setEditTime(e.target.value)}
                              className="w-full text-xs border border-slate-200 p-2 rounded bg-white text-slate-700 font-bold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[8px] font-bold text-slate-400 uppercase font-semibold">地點</label>
                            <input
                              type="text"
                              value={editLocation}
                              onChange={(e) => setEditLocation(e.target.value)}
                              className="w-full text-xs border border-slate-200 p-2 rounded bg-white text-slate-700 font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold text-slate-400 uppercase font-semibold">備註</label>
                            <input
                              type="text"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              className="w-full text-xs border border-slate-200 p-2 rounded bg-white text-slate-700 font-medium"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingTaskId(null)}
                            className="text-[10px] text-slate-400 hover:text-slate-600 font-bold px-2 py-1"
                          >
                            取消
                          </button>
                          <button
                            type="button"
                            onClick={() => saveTaskEdit(t.id)}
                            className="inline-flex items-center space-x-1.5 text-[10px] bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-3 py-1.5 rounded-lg"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>保存</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display static task timeline card */
                      <div className="bg-white hover:bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 shadow-xs transition hover:shadow-xs relative">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start space-x-2.5">
                            {/* Completion Checkbox */}
                            <button
                              onClick={() => handleToggleTask(t.id)}
                              className="mt-0.5 text-slate-400 hover:text-emerald-500 transition shrink-0"
                            >
                              {t.completed ? (
                                <CheckSquare className="w-4.5 h-4.5 text-emerald-500 fill-emerald-50" />
                              ) : (
                                <Square className="w-4.5 h-4.5" />
                              )}
                            </button>

                            {/* Content info */}
                            <div>
                              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                <span className="bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded text-[10px] inline-flex items-center space-x-1 shrink-0">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{t.time}</span>
                                </span>
                                <h5
                                  className={`text-xs font-extrabold tracking-tight ${
                                    t.completed ? "text-slate-400 line-through font-bold" : "text-slate-800"
                                  }`}
                                >
                                  {t.title}
                                </h5>
                              </div>

                              {t.location && (
                                <p className="text-[10px] text-slate-400 font-bold mt-1 inline-flex items-center space-x-0.5">
                                  <MapPin className="w-3 h-3 text-sky-400" />
                                  <span>{t.location}</span>
                                </p>
                              )}

                              {t.description && (
                                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed bg-slate-50 p-2 rounded-lg font-medium border border-slate-100/50 break-words max-w-full">
                                  {t.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Control action buttons */}
                          <div className="opacity-0 group-hover/item:opacity-100 focus-within:opacity-100 flex items-center space-x-1.5 transition shrink-0">
                            {/* Toggle Alarm Reminder trigger button */}
                            <button
                              onClick={() => handleToggleReminder(t.id, 15)}
                              className={`p-1.5 rounded-lg border transition ${
                                t.reminderEnabled
                                  ? "bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100"
                                  : "bg-white border-slate-100 text-slate-400 hover:text-slate-500 hover:bg-slate-50"
                              }`}
                              title={t.reminderEnabled ? "提醒已設定 (活動前15分)" : "設定時間通知提醒"}
                            >
                              {t.reminderEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                            </button>

                            {/* Edit btn */}
                            <button
                              onClick={() => startEditing(t)}
                              className="p-1.5 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg border border-slate-100 transition"
                              title="編輯此項"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete btn */}
                            <button
                              onClick={() => handleDeleteTask(t.id)}
                              className="p-1.5 bg-white hover:text-rose-500 rounded-lg border border-slate-100 text-slate-400 transition"
                              title="刪除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Passive warning notification status flag if alarm is on */}
                        {t.reminderEnabled && (
                          <div className="absolute top-2 right-2 flex items-center space-x-1 bg-amber-50 text-amber-600 text-[9px] font-bold py-0.5 px-1.5 rounded border border-amber-100 select-none group-hover/item:hidden">
                            <Bell className="w-2.5 h-2.5" />
                            <span>15分前通知</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
