import React, { useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { collection, query, where, getDocs, setDoc, deleteDoc, doc } from "firebase/firestore";
import { db, auth, signInWithGoogle, logout, handleFirestoreError, OperationType } from "./lib/firebase";
import { defaultTrip } from "./lib/defaultTrip";
import { Trip, Task, Landmark } from "./types";

// Import Components
import Navbar from "./components/Navbar";
import WeatherWidget from "./components/WeatherWidget";
import SearchLandmarks from "./components/SearchLandmarks";
import TripSelection from "./components/TripSelection";
import TripDetail from "./components/TripDetail";
import ReminderSystem from "./components/ReminderSystem";

// Icons for embellishments
import { MapPin, Compass, ShieldAlert, Sparkles, AlertCircle, HelpCircle } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [syncState, setSyncState] = useState<"local" | "syncing" | "synced" | "error">("local");

  // Notifications and alarm lists status
  const [triggeredAlerts, setTriggeredAlerts] = useState<{ task: Task; tripTitle: string; timestamp: number }[]>([]);

  const activeTrip = trips.find((t) => t.id === activeTripId) || null;

  // 1. Initial Authentication observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      if (firebaseUser) {
        setSyncState("syncing");
        await loadTripsFromCloud(firebaseUser.uid);
      } else {
        loadTripsFromLocal();
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Load trips from local storage fallback
  const loadTripsFromLocal = () => {
    try {
      const stored = localStorage.getItem("itinerary_trips");
      const savedActiveId = localStorage.getItem("itinerary_active_id");
      if (stored) {
        const parsedTrips = JSON.parse(stored);
        if (parsedTrips.length > 0) {
          setTrips(parsedTrips);
          setActiveTripId(savedActiveId || parsedTrips[0].id);
          setSyncState("local");
          return;
        }
      }
      // If no local config exists, initialize with standard default Penghu trip
      setTrips([defaultTrip]);
      setActiveTripId(defaultTrip.id);
      setSyncState("local");
    } catch (e) {
      console.error("Local storage read exception, fall back:", e);
      setTrips([defaultTrip]);
      setActiveTripId(defaultTrip.id);
    }
  };

  // 3. Load trips from Firebase Firestore Cloud Database
  const loadTripsFromCloud = async (userId: string) => {
    setSyncState("syncing");
    const path = "trips";
    try {
      const q = query(collection(db, path), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const cloudTrips: Trip[] = [];

      querySnapshot.forEach((document) => {
        cloudTrips.push({ id: document.id, ...document.data() } as Trip);
      });

      if (cloudTrips.length > 0) {
        setTrips(cloudTrips);
        // Set active trip to previously saved or first one
        const previousActiveId = localStorage.getItem(`itinerary_active_id_${userId}`) || localStorage.getItem("itinerary_active_id");
        const match = cloudTrips.find((t) => t.id === previousActiveId);
        setActiveTripId(match ? match.id : cloudTrips[0].id);
        setSyncState("synced");
      } else {
        // Brand new user with empty cloud collection! Proactively seed their cloud databases with default trip for amazing onboarding
        const seededTrip = { ...defaultTrip, id: `trip-${Date.now()}`, userId };
        await setDoc(doc(db, path, seededTrip.id), seededTrip);
        setTrips([seededTrip]);
        setActiveTripId(seededTrip.id);
        setSyncState("synced");
      }
    } catch (error) {
      setSyncState("error");
      handleFirestoreError(error, OperationType.LIST, path);
    }
  };

  // 4. Reset to pre-populated template data
  const handleResetToDefault = async () => {
    if (confirm("確認要還原行程為澎湖四天三夜經典行程範本嗎？原有其他變更將會被覆蓋。")) {
      const targetTrip = { ...defaultTrip };
      if (user) {
        setSyncState("syncing");
        targetTrip.id = `trip-penghu-${Date.now()}`;
        targetTrip.userId = user.uid;
        try {
          await setDoc(doc(db, "trips", targetTrip.id), targetTrip);
          setTrips([targetTrip]);
          setActiveTripId(targetTrip.id);
          setSyncState("synced");
        } catch (err) {
          setSyncState("error");
          console.error(err);
        }
      } else {
        setTrips([targetTrip]);
        setActiveTripId(targetTrip.id);
        localStorage.setItem("itinerary_trips", JSON.stringify([targetTrip]));
        localStorage.setItem("itinerary_active_id", targetTrip.id);
        setSyncState("local");
      }
    }
  };

  // 5. Create new trip plan
  const handleCreateTrip = async (tripData: Omit<Trip, "id" | "createdAt" | "updatedAt">) => {
    const newTrip: Trip = {
      ...tripData,
      id: `trip-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (user) {
      newTrip.userId = user.uid;
      setSyncState("syncing");
      try {
        await setDoc(doc(db, "trips", newTrip.id), newTrip);
        const updatedList = [...trips, newTrip];
        setTrips(updatedList);
        setActiveTripId(newTrip.id);
        setSyncState("synced");
      } catch (err) {
        setSyncState("error");
        console.error("Cloud insert failed:", err);
      }
    } else {
      const updatedList = [...trips, newTrip];
      setTrips(updatedList);
      setActiveTripId(newTrip.id);
      localStorage.setItem("itinerary_trips", JSON.stringify(updatedList));
      localStorage.setItem("itinerary_active_id", newTrip.id);
      setSyncState("local");
    }
  };

  // 6. Delete a trip
  const handleDeleteTrip = async (id: string) => {
    if (user) {
      setSyncState("syncing");
      try {
        await deleteDoc(doc(db, "trips", id));
        const remaining = trips.filter((t) => t.id !== id);
        setTrips(remaining);
        if (activeTripId === id) {
          setActiveTripId(remaining.length > 0 ? remaining[0].id : null);
        }
        setSyncState("synced");
      } catch (err) {
        setSyncState("error");
        console.error("Cloud deletion failed:", err);
      }
    } else {
      const remaining = trips.filter((t) => t.id !== id);
      setTrips(remaining);
      if (activeTripId === id) {
        setActiveTripId(remaining.length > 0 ? remaining[0].id : null);
      }
      localStorage.setItem("itinerary_trips", JSON.stringify(remaining));
      localStorage.setItem("itinerary_active_id", remaining.length > 0 ? remaining[0].id : "");
      setSyncState("local");
    }
  };

  // 7. Update an existing active trip details
  const handleUpdateTrip = async (updatedTrip: Trip) => {
    // Optimistic local state update
    const updatedTripsList = trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t));
    setTrips(updatedTripsList);

    if (user) {
      setSyncState("syncing");
      try {
        await setDoc(doc(db, "trips", updatedTrip.id), updatedTrip);
        setSyncState("synced");
      } catch (err) {
        setSyncState("error");
        console.error("Cloud synchronization write failed:", err);
      }
    } else {
      localStorage.setItem("itinerary_trips", JSON.stringify(updatedTripsList));
      localStorage.setItem("itinerary_active_id", updatedTrip.id);
      setSyncState("local");
    }
  };

  // 8. Trigger alert alarms helper
  const handleTriggerAlarm = (task: Task, tripTitle: string) => {
    const isAlreadyTriggered = triggeredAlerts.some((alert) => alert.task.id === task.id);
    if (!isAlreadyTriggered) {
      setTriggeredAlerts((prev) => [
        ...prev,
        {
          task,
          tripTitle,
          timestamp: Date.now(),
        },
      ]);
    }
  };

  // 9. Interactive add searched landmark directly to itinerary
  const handleAddLandmarkToDay = (day: string, landmark: Landmark, time: string) => {
    if (!activeTrip) return;

    const newTask: Task = {
      id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      time,
      title: landmark.name,
      location: landmark.address || landmark.name,
      description: `${landmark.description}\n特色亮點: ${landmark.highlight}`,
      completed: false,
      reminderEnabled: true,
      reminderMinutesBefore: 15, // default 15 minutes before
    };

    // Append to selected day task lists
    const dayTasks = activeTrip.schedule[day] || [];
    const updatedTrip: Trip = {
      ...activeTrip,
      schedule: {
        ...activeTrip.schedule,
        [day]: [...dayTasks, newTask],
      },
      updatedAt: Date.now(),
    };

    handleUpdateTrip(updatedTrip);
    alert(`成功加入！「${landmark.name}」已安排在第 ${Object.keys(activeTrip.schedule).sort().indexOf(day) + 1} 天 (${day.substring(5)}) 的 ${time}`);
  };

  // Login handler
  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error(e);
      setSyncState("error");
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    setAuthLoading(true);
    try {
      await logout();
      setUser(null);
      loadTripsFromLocal();
    } catch (e) {
      console.error(e);
    } finally {
      setAuthLoading(false);
    }
  };

  // Periodic Reminder Engine - checks every 4 seconds to see if any reminder condition triggers
  useEffect(() => {
    const checkReminders = () => {
      if (!activeTrip) return;

      const now = new Date();
      const currentHH = now.getHours();
      const currentMM = now.getMinutes();

      // For testing/demonstration convenience, we check if:
      // any task has reminderEnabled: true, reminderTriggered !== true,
      // and the physical current minute/hour matches the task time (minus offset)!
      const datesList = Object.keys(activeTrip.schedule);

      datesList.forEach((dateString) => {
        const tasks = activeTrip.schedule[dateString] || [];

        tasks.forEach((task) => {
          if (!task.reminderEnabled || task.reminderTriggered) return;

          // Parse task time HH:MM
          const [taskHHStr, taskMMStr] = task.time.split(":");
          const taskHH = parseInt(taskHHStr, 10);
          const taskMM = parseInt(taskMMStr, 10);

          if (isNaN(taskHH) || isNaN(taskMM)) return;

          // Compute absolute minutes from midnight of task and current clock
          const taskAbsMin = taskHH * 60 + taskMM;
          const currentAbsMin = currentHH * 60 + currentMM;

          // If offset matches: e.g. task is 13:30, offset is 15 minutes, reminder absolute minute is 13:15
          const alertAbsMin = taskAbsMin - task.reminderMinutesBefore;

          // Alarms trigger window: match exact minute (or within a 1-minute window)
          if (currentAbsMin === alertAbsMin) {
            // Found matched task! Play synth sound & push to alerts
            handleTriggerAlarm(task, activeTrip.title);

            // Flag as triggered to avoid repeating in the same minute
            const updatedTasks = tasks.map((t) => (t.id === task.id ? { ...t, reminderTriggered: true } : t));
            const updatedTrip = {
              ...activeTrip,
              schedule: {
                ...activeTrip.schedule,
                [dateString]: updatedTasks,
              },
              updatedAt: Date.now(),
            };

            // Write back
            handleUpdateTrip(updatedTrip);
          }
        });
      });
    };

    const interval = setInterval(checkReminders, 4000);
    return () => clearInterval(interval);
  }, [activeTrip, triggeredAlerts]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="app-viewport">
      {/* Navbar component */}
      <Navbar
        user={user}
        loading={authLoading}
        syncState={syncState}
        onLogin={handleGoogleLogin}
        onLogout={handleLogout}
        activeTripTitle={activeTrip?.title}
        onBackToTrips={() => {}} // Not strictly needing toggled drawer
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Banner Alert and Quick Stats */}
        <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="relative z-10 space-y-2">
            <span className="bg-white/20 backdrop-blur-md text-[10px] font-black tracking-widest uppercase py-1 px-3 rounded-full text-sky-100 flex items-center space-x-1.5 w-max">
              <Sparkles className="w-3.5 h-3.5" />
              <span>澎湖四天三夜自遊特別版</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
              智慧旅遊行程管理助手
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl font-medium leading-relaxed">
              預載專屬澎湖行程，支援每日任務清單與計時通知。連線雲端隨時保存！
            </p>
          </div>

          <div className="relative z-10 flex shrink-0 items-center justify-start gap-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 min-w-[120px] shadow-xs">
              <div className="text-[10px] font-bold text-sky-100">當前計畫總數</div>
              <div className="text-2xl font-black mt-1">{trips.length} 個</div>
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Area (itinerary detail / creation list) - taking 8 columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* Trip management lists selection view */}
            <TripSelection
              trips={trips}
              activeTripId={activeTripId}
              onSelectTrip={setActiveTripId}
              onCreateTrip={handleCreateTrip}
              onDeleteTrip={handleDeleteTrip}
              onResetToDefault={handleResetToDefault}
            />

            {/* active details schedule planner section */}
            {activeTrip ? (
              <TripDetail
                trip={activeTrip}
                onUpdateTrip={handleUpdateTrip}
                onTriggerAlarm={(task) => handleTriggerAlarm(task, activeTrip.title)}
              />
            ) : (
              <div className="bg-white border select-none border-slate-100 p-8 text-center rounded-2xl">
                <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2 animate-pulse" />
                <p className="text-xs text-slate-400 font-bold">請點選上方旅行計畫卡，即可開始規劃詳細的時間軸任務！</p>
              </div>
            )}
          </div>

          {/* Right Sub-rail Sidebar - weather, searches, Alarms - taking 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            {/* Dynamic Real-time alarm notification module */}
            <ReminderSystem
              activeTrip={activeTrip}
              onDismissAlarm={() => {}}
              triggeredAlerts={triggeredAlerts}
              onRemoveAlert={(taskId) => setTriggeredAlerts((p) => p.filter((x) => x.task.id !== taskId))}
            />

            {/* Weather Widget */}
            <WeatherWidget initialLocation={activeTrip ? activeTrip.location : "澎湖"} />

            {/* Recommendations Guides Landmarks direct schedulers */}
            {activeTrip && (
              <SearchLandmarks
                tripLocation={activeTrip.location}
                tripDays={Object.keys(activeTrip.schedule).sort()}
                onAddLandmarkToDay={handleAddLandmarkToDay}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer credits design elements */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center select-none" id="main-footer">
        <p className="text-[11px] text-slate-400 font-bold">澎湖自遊管家 • 2026 夏日特別版</p>
        <p className="text-[10px] text-slate-300 mt-1">智慧行程排程 • 本地 & Firebase Firestore 備份同步技術</p>
      </footer>
    </div>
  );
}
