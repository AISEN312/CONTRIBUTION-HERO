import React, { useState, useEffect } from "react";
import { CivicReport } from "./types";
import NeighborhoodMap from "./components/NeighborhoodMap";
import ReportForm from "./components/ReportForm";
import ReportCard from "./components/ReportCard";
import GamificationPanel from "./components/GamificationPanel";
import {
  Shield,
  Activity,
  CheckCircle,
  Clock,
  Sparkles,
  Award,
  Terminal,
  Grid,
  MapPin,
  HelpCircle
} from "lucide-react";

export default function App() {
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userXP, setUserXP] = useState(135); // Starting seeded XP
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([
    "Road Warrior",
    "Spark Ranger"
  ]);
  const [activeTab, setActiveTab] = useState<"map" | "form" | "achievements">("map");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Terminal diagnostic logs
  const [logs, setLogs] = useState<string[]>([
    "System booted. Local node online.",
    "Awaiting user report or preset submission..."
  ]);

  // Fetch reports on mount
  useEffect(() => {
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data: CivicReport[]) => {
        setReports(data);
        if (data.length > 0) {
          setSelectedReport(data[0]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch reports:", err);
        addLog("SYSTEM ERROR: Failed to load reports from backend node.");
      });
  }, []);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${msg}`, ...prev.slice(0, 15)]);
  };

  const handleSelectReport = (report: CivicReport) => {
    setSelectedReport(report);
    addLog(`FOCUSED REPORT: "${report.title}"`);
  };

  // Upvote report handler
  const handleUpvote = async (id: string) => {
    try {
      const res = await fetch(`/api/reports/${id}/upvote`, { method: "POST" });
      const updated: CivicReport = await res.json();
      
      setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
      if (selectedReport?.id === id) {
        setSelectedReport(updated);
      }
      
      // Award upvote XP
      setUserXP((prev) => prev + 5);
      addLog(`UPVOTED REPORT: ID ${id}. Earned +5 XP!`);
    } catch (err) {
      console.error(err);
    }
  };

  // Verify / complete local task handler
  const handleVerify = async (id: string) => {
    try {
      const res = await fetch(`/api/reports/${id}/verify`, { method: "POST" });
      const updated: CivicReport = await res.json();
      
      setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
      if (selectedReport?.id === id) {
        setSelectedReport(updated);
      }

      // Extract XP points from report analysis if present
      const xpAward = updated.analysis?.gamification?.xp_rewarded || 20;
      const badgeAward = updated.analysis?.gamification?.badge_unlocked;

      setUserXP((prev) => prev + xpAward);
      if (badgeAward && !unlockedBadges.includes(badgeAward)) {
        setUnlockedBadges((prev) => [...prev, badgeAward]);
        addLog(`ACHIEVEMENT UNLOCKED: "${badgeAward}"!`);
      }

      addLog(`VERIFIED TASK: Completed verification for "${updated.title}". Earned +${xpAward} XP!`);
    } catch (err) {
      console.error(err);
    }
  };

  // Submit and run analysis
  const handleSubmitReport = async (payload: {
    title: string;
    description: string;
    imageBase64?: string;
    mediaType?: string;
    latitude: number;
    longitude: number;
  }) => {
    setIsAnalyzing(true);
    addLog("UPLOADING CIVIC MEDIA EVIDENCE...");
    
    // Simulate terminal steps
    const timer1 = setTimeout(() => addLog("PARSING IMAGE PARTICLE FIELDS VIA GEMINI-3.5-FLASH..."), 800);
    const timer2 = setTimeout(() => addLog("CALCULATING HYPERLOCAL SEVERITY COEFFICIENTS..."), 1600);
    const timer3 = setTimeout(() => addLog("STRUCTURING MUNICIPAL DISPATCH PAYLOAD..."), 2400);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: CivicReport = await res.json();
      
      setReports((prev) => [data, ...prev]);
      setSelectedReport(data);

      const xp = data.analysis?.gamification?.xp_rewarded || 40;
      const badge = data.analysis?.gamification?.badge_unlocked;

      setUserXP((prev) => prev + xp);
      if (badge && !unlockedBadges.includes(badge)) {
        setUnlockedBadges((prev) => [...prev, badge]);
      }

      addLog(`DISPATCHED ROUTED TO: ${data.analysis?.agentic_actions?.municipality_dispatch_payload?.department}`);
      addLog(`SUCCESS: New report analysis complete. Earned +${xp} XP.`);
    } catch (err) {
      console.error(err);
      addLog("ERROR: Multimodal analysis aborted or timed out.");
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsAnalyzing(false);
    }
  };

  // Stats counters
  const totalReports = reports.length;
  const verifiedReports = reports.filter((r) => r.status === "Verified" || r.status === "Dispatched" || r.status === "Resolved").length;
  const dispatchedReports = reports.filter((r) => r.status === "Dispatched" || r.status === "Resolved").length;
  const resolvedReports = reports.filter((r) => r.status === "Resolved").length;

  // Filtered reports list
  const filteredReports = reports.filter((r) => {
    if (categoryFilter === "All") return true;
    return r.analysis?.category === categoryFilter;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased font-sans">
      {/* Primary Navigation / Header */}
      <header className="bg-zinc-900/60 border-b border-zinc-800/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/15">
              <Shield className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-zinc-100 text-lg tracking-tight leading-none">COMMUNITY HERO</h1>
                <span className="bg-indigo-500/15 border border-indigo-500/20 rounded-full px-2 py-0.5 text-[9px] font-mono text-indigo-400 font-semibold uppercase tracking-wider">
                  AI_ENGINE_v4.2
                </span>
              </div>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-0.5 font-bold">Real-time Civic Diagnostics Pipeline</p>
            </div>
          </div>

          {/* Quick User Stats Header */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-xs">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-emerald-500">ENGINE ONLINE</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full hidden md:block">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">REQ_ID: CH-8892-X</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        {/* Core Stats Bar */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3.5 p-2">
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-850 text-indigo-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Issues Logged</div>
              <div className="text-xl font-bold font-mono text-zinc-200">{totalReports}</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-850 text-sky-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Citizen Verified</div>
              <div className="text-xl font-bold font-mono text-zinc-200">{verifiedReports}</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-850 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Dispatched Crews</div>
              <div className="text-xl font-bold font-mono text-zinc-200">{dispatchedReports}</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-850 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Fully Resolved</div>
              <div className="text-xl font-bold font-mono text-zinc-200">{resolvedReports}</div>
            </div>
          </div>
        </section>

        {/* Bento Dashboard Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (Forms, Achievements, Interactive toggles) - 4 Cols */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Desktop Quick Nav Menu */}
            <div className="bg-zinc-900 border border-zinc-800 p-1.5 rounded-xl flex gap-1 text-xs">
              <button
                onClick={() => setActiveTab("map")}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === "map" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Neighborhood Grid
              </button>
              <button
                onClick={() => setActiveTab("form")}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === "form" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                File Report
              </button>
              <button
                onClick={() => setActiveTab("achievements")}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === "achievements" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Leaderboard
              </button>
            </div>

            {/* Render selected active tab pane */}
            {activeTab === "map" && (
              <NeighborhoodMap
                reports={reports}
                selectedReport={selectedReport}
                onSelectReport={handleSelectReport}
              />
            )}

            {activeTab === "form" && (
              <ReportForm onSubmitReport={handleSubmitReport} isAnalyzing={isAnalyzing} />
            )}

            {activeTab === "achievements" && (
              <GamificationPanel userXP={userXP} unlockedBadges={unlockedBadges} />
            )}

            {/* Active System Diagnostic Console */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-lg flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-zinc-850 pb-2 text-xs font-mono text-zinc-500">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-500 animate-pulse" />
                  <span>MULTIMODAL DISPATCH TERMINAL</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-zinc-700"></div>
                  <div className="w-1 h-1 bg-zinc-700"></div>
                  <div className="w-1 h-1 bg-zinc-700"></div>
                </div>
              </div>
              <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-3 h-[120px] overflow-y-auto font-mono text-[10px] text-emerald-400 leading-relaxed flex flex-col-reverse gap-1.5 scrollbar-thin">
                {logs.map((log, idx) => (
                  <div key={idx} className={idx === 0 ? "text-indigo-400 font-bold" : "text-zinc-500"}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column (Issues List & Selector) - 4 Cols */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-semibold text-zinc-200 text-sm flex items-center gap-2">
                <Grid className="w-4 h-4 text-indigo-500" />
                Active Incidents Feed ({filteredReports.length})
              </h3>

              {/* Quick Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] text-zinc-300 font-mono focus:outline-none p-1.5 focus:border-indigo-500"
              >
                <option value="All">All Categories</option>
                <option value="Public Works">Public Works</option>
                <option value="Electrical/Streetlights">Streetlights</option>
                <option value="Water & Sanitation">Water & San.</option>
                <option value="Waste Management">Waste Mgmt</option>
              </select>
            </div>

            {/* Scrollable list of reports */}
            <div className="flex flex-col gap-3 max-h-[640px] overflow-y-auto scrollbar-thin pr-1">
              {filteredReports.map((report) => {
                const isSelected = selectedReport?.id === report.id;
                const category = report.analysis?.category || "Civic Incident";
                const isResolved = report.status === "Resolved";

                return (
                  <div
                    key={report.id}
                    onClick={() => handleSelectReport(report)}
                    className={`border rounded-xl p-3.5 flex gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-zinc-900 border-indigo-500 shadow-lg scale-99"
                        : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60"
                    }`}
                  >
                    {/* Thumbnail preview */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-800 bg-zinc-950">
                      <img
                        src={report.imageUrl}
                        alt={report.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider truncate">
                            {category}
                          </span>
                          <span className={`text-[8px] font-mono border rounded px-1.5 py-0.5 uppercase tracking-wider font-bold ${
                            report.status === "Resolved"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : report.status === "Dispatched"
                              ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse"
                              : "bg-zinc-800 text-zinc-300 border-zinc-700"
                          }`}>
                            {report.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-zinc-200 truncate mt-1">{report.title}</h4>
                        <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{report.description}</p>
                      </div>

                      {/* Upvotes / date */}
                      <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 mt-2">
                        <span>★ {report.upvotes} UPVOTES</span>
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredReports.length === 0 && (
                <div className="p-8 text-center bg-zinc-900/30 border border-zinc-800/80 rounded-xl text-zinc-500 text-xs font-mono flex flex-col items-center gap-1.5">
                  <HelpCircle className="w-5 h-5 text-zinc-600" />
                  No reports logged under this category.
                </div>
              )}
            </div>
          </div>

          {/* Right Column (AI Diagnostics / Details Panel) - 4 Cols */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h3 className="font-semibold text-zinc-200 text-sm border-b border-zinc-800 pb-2">
              Incident Diagnostics Hub
            </h3>

            {selectedReport ? (
              <ReportCard
                report={selectedReport}
                onUpvote={handleUpvote}
                onVerify={handleVerify}
              />
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 font-mono text-xs">
                Select an incident from the feed or neighborhood map to inspect visual diagnostics.
              </div>
            )}
          </div>

        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 bg-zinc-900/30 py-6 mt-12 text-center text-zinc-500 text-xs font-mono">
        <p>Community Hero Platform © 2026 • Hyperlocal Incident Analytics Network</p>
      </footer>
    </div>
  );
}
