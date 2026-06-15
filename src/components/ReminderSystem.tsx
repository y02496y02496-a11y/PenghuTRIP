import React, { useState, useEffect } from "react";
import { Bell, X, Compass, Volume2, VolumeX, AlertTriangle, Clock } from "lucide-react";
import { Trip, Task } from "../types";

interface ReminderSystemProps {
  activeTrip: Trip | null;
  onDismissAlarm: () => void;
  triggeredAlerts: { task: Task; tripTitle: string; timestamp: number }[];
  onRemoveAlert: (taskId: string) => void;
}

export default function ReminderSystem({
  activeTrip,
  onDismissAlarm,
  triggeredAlerts,
  onRemoveAlert,
}: ReminderSystemProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play synthetic audio chime alert using Web Audio API
  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Note 1: High sweet chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain1.gain.setValueAtTime(0, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.6);

      // Note 2: Harmonics fraction delayed
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(1109.73, ctx.currentTime); // C#6 note
        gain2.gain.setValueAtTime(0, ctx.currentTime);
        gain2.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.8);
      }, 120);
    } catch (e) {
      console.warn("Unable to play sound in this browser setup:", e);
    }
  };

  // Play audio chime when new alarm is listed
  useEffect(() => {
    if (triggeredAlerts.length > 0) {
      playAlertSound();
    }
  }, [triggeredAlerts.length]);

  // Sync internal countdown clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatClock = (date: Date) => {
    return date.toTimeString().split(" ")[0]; // e.g. "09:54:21"
  };

  return (
    <div id="reminder-background-hub" className="select-none">
      {/* Clock banner */}
      <div className="bg-slate-800 text-white p-3 rounded-2xl flex items-center justify-between border border-slate-700/50 shadow-sm mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold tracking-wider text-slate-300">目前系統時間</span>
        </div>
        <div className="flex items-center space-x-3.5">
          <span className="font-mono text-xs font-black text-sky-300 tracking-widest">{formatClock(currentTime)}</span>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-slate-400 hover:text-white transition"
            title={soundEnabled ? "關閉提醒音效" : "開啟提醒音效"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating alarm alerts container */}
      {triggeredAlerts.length > 0 && (
        <div className="space-y-2.5 mb-4" id="active-alerts-list">
          {triggeredAlerts.map((alert) => (
            <div
              key={alert.task.id}
              className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 shadow-sm relative flex items-start gap-3 animate-fade-in"
            >
              <div className="bg-amber-100 text-amber-700 p-2 rounded-lg flex items-center justify-center shrink-0">
                <Bell className="w-4.5 h-4.5 animate-bounce" />
              </div>

              <div className="flex-1 pr-4">
                <h4 className="text-xs font-extrabold text-amber-900 tracking-tight">
                  【時間提醒】 {alert.task.title}
                </h4>
                {alert.task.location && (
                  <p className="text-[10px] text-amber-700 font-bold mt-1 inline-flex items-center gap-0.5">
                    <Compass className="w-3 h-3" />
                    <span>位置: {alert.task.location}</span>
                  </p>
                )}
                {alert.task.time && (
                  <p className="text-[10px] text-amber-800 font-extrabold mt-0.5">
                    出發排定時間：<span className="bg-amber-100/70 px-1 rounded">{alert.task.time}</span> (活動前 {alert.task.reminderMinutesBefore} 分鐘提醒)
                  </p>
                )}
                {alert.task.description && (
                  <p className="text-[11px] text-amber-700 bg-white/50 p-2 rounded border border-amber-100 mt-1.5 leading-relaxed font-semibold max-w-full truncate">
                    {alert.task.description}
                  </p>
                )}
              </div>

              {/* Close individual alert element */}
              <button
                onClick={() => onRemoveAlert(alert.task.id)}
                className="text-amber-400 hover:text-amber-800 absolute top-2.5 right-2.5 p-1 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tips indicator about reminders */}
      {triggeredAlerts.length === 0 && (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-slate-500 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-sky-400 shrink-0" />
          <p className="text-[11px] text-slate-400 leading-normal font-medium">
            提示：點選任何活動右側之 <Bell className="w-3 h-3 inline text-amber-400" /> 響鈴圖示即可設定智慧提醒，系統將自動於排定時間前通知您！
          </p>
        </div>
      )}
    </div>
  );
}
