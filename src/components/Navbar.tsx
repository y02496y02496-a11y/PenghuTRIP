import React from "react";
import { Cloud, CloudLightning, LogIn, LogOut, User, MapPin } from "lucide-react";
import { User as FirebaseUser } from "firebase/auth";

interface NavbarProps {
  user: FirebaseUser | null;
  loading: boolean;
  syncState: "local" | "syncing" | "synced" | "error";
  onLogin: () => void;
  onLogout: () => void;
  activeTripTitle?: string;
  onBackToTrips?: () => void;
}

export default function Navbar({
  user,
  loading,
  syncState,
  onLogin,
  onLogout,
  activeTripTitle,
  onBackToTrips,
}: NavbarProps) {
  const getSyncIcon = () => {
    switch (syncState) {
      case "synced":
        return <Cloud className="w-5 h-5 text-emerald-500" />;
      case "syncing":
        return <CloudLightning className="w-5 h-5 text-amber-500 animate-pulse" />;
      case "error":
        return <Cloud className="w-5 h-5 text-rose-500" />;
      default:
        return <Cloud className="w-5 h-5 text-slate-400" />;
    }
  };

  const getSyncText = () => {
    switch (syncState) {
      case "synced":
        return "雲端備份已同步";
      case "syncing":
        return "同步中...";
      case "error":
        return "同步失敗，請重試";
      default:
        return "本地存儲模式";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm" id="header-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand or Back */}
        <div className="flex items-center space-x-3">
          {onBackToTrips && activeTripTitle ? (
            <button
              onClick={onBackToTrips}
              className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition text-sm font-medium bg-slate-50 hover:bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-100"
              id="back-to-trips-btn"
            >
              ← 選擇其他行程
            </button>
          ) : (
            <div className="flex items-center space-x-2" id="brand-logo">
              <div className="bg-sky-500 text-white p-2 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">夏日行程管家</h1>
                <p className="text-xs text-slate-400 font-medium">Itinerary & guide planner</p>
              </div>
            </div>
          )}

          {activeTripTitle && (
            <div className="hidden md:flex items-center bg-sky-50 text-sky-700 text-xs px-2.5 py-1 rounded-full font-semibold border border-sky-100 max-w-xs truncate">
              正在編輯: {activeTripTitle}
            </div>
          )}
        </div>

        {/* Right: Sync Status & Auth */}
        <div className="flex items-center space-x-4">
          {/* Sync status badge */}
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 text-xs text-slate-500">
            {getSyncIcon()}
            <span className="hidden sm:inline font-medium">{getSyncText()}</span>
          </div>

          {/* User authentication portal */}
          {loading ? (
            <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-sky-500 animate-spin" />
          ) : user ? (
            <div className="flex items-center space-x-3" id="user-profile">
              <div className="flex items-center space-x-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-8 h-8 rounded-full border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center border border-slate-200">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <span className="hidden lg:inline text-xs text-slate-600 font-semibold max-w-[100px] truncate">
                  {user.displayName || user.email}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition"
                title="登出帳號"
                id="logout-btn"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center space-x-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 px-3.5 py-2 rounded-xl shadow-sm transition"
              id="google-login-btn"
            >
              <LogIn className="w-4 h-4" />
              <span>綁定 Google 雲端同步</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
