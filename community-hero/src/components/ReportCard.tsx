import React, { useState } from "react";
import { CivicReport } from "../types";
import {
  Calendar,
  ThumbsUp,
  MapPin,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Building,
  Wrench,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  CloudSun,
  Eye,
  Activity,
  Award
} from "lucide-react";

interface ReportCardProps {
  report: CivicReport;
  onUpvote: (id: string) => void;
  onVerify: (id: string) => void;
}

export default function ReportCard({ report, onUpvote, onVerify }: ReportCardProps) {
  const [verifying, setVerifying] = useState(false);

  const handleVerifyClick = async () => {
    setVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    onVerify(report.id);
    setVerifying(false);
  };

  // Convert status to badge styling
  const getStatusBadge = (status: CivicReport["status"]) => {
    switch (status) {
      case "Reported":
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
      case "Analyzing":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse";
      case "Verified":
        return "bg-sky-500/10 text-sky-400 border-sky-500/30";
      case "Dispatched":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
      case "Resolved":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  // Map category colors
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "Public Works":
        return "text-indigo-400 bg-indigo-950/30 border-indigo-850/40";
      case "Electrical/Streetlights":
        return "text-amber-400 bg-amber-950/30 border-amber-850/40";
      case "Water & Sanitation":
        return "text-sky-400 bg-sky-950/30 border-sky-850/40";
      case "Waste Management":
        return "text-emerald-400 bg-emerald-950/30 border-emerald-850/40";
      case "Public Safety":
        return "text-red-400 bg-red-950/30 border-red-850/40";
      default:
        return "text-zinc-400 bg-zinc-950/30 border-zinc-850/40";
    }
  };

  // Severity rating scale mapper helper
  const getSeverityScoreAndPercent = (severity?: string) => {
    switch (severity) {
      case "Critical": return { score: "9.5", percent: "95%" };
      case "High": return { score: "8.4", percent: "84%" };
      case "Medium": return { score: "6.2", percent: "62%" };
      case "Low": return { score: "3.5", percent: "35%" };
      default: return { score: "5.0", percent: "50%" };
    }
  };

  const analysis = report.analysis;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col h-full">
      {/* Report Hero Image */}
      <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden border-b border-zinc-800">
        <img
          src={report.imageUrl}
          alt={report.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent"></div>

        {/* Floating Headers */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-2.5 py-1 text-[10px] font-mono border rounded-full uppercase tracking-wider font-semibold shadow-md ${getStatusBadge(report.status)}`}>
            ● {report.status}
          </span>
          {analysis?.category && (
            <span className={`px-2.5 py-1 text-[10px] font-mono border rounded-full uppercase tracking-wider font-semibold shadow-md ${getCategoryColor(analysis.category)}`}>
              {analysis.category}
            </span>
          )}
        </div>

        {/* Upvotes overlay */}
        <div className="absolute bottom-4 right-4 bg-zinc-950/95 border border-zinc-800/80 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-mono text-zinc-100 hover:bg-zinc-900 transition-colors shadow-lg">
          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Scanning Line simulation */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] z-20"></div>
      </div>

      {/* Main Details Panel */}
      <div className="p-6 flex-1 flex flex-col gap-5">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block mb-1">
            MULTIMODAL SOURCE: {report.id.startsWith("sample") ? report.id.toUpperCase() : "MOBILE_UPLOAD_01"}.JPG
          </span>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight leading-snug">{report.title}</h2>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{report.description}</p>
        </div>

        {/* Upvoting and Quick Coordinates row */}
        <div className="flex items-center justify-between border-y border-zinc-800/60 py-3 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[10px]">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span>{report.latitude.toFixed(4)}° N, {report.longitude.toFixed(4)}° W</span>
          </div>

          <button
            onClick={() => onUpvote(report.id)}
            className="flex items-center gap-1.5 bg-zinc-950 hover:bg-zinc-850 text-indigo-400 border border-zinc-850 px-3 py-1.5 rounded-xl transition-all font-semibold cursor-pointer active:scale-95"
          >
            <ThumbsUp className="w-3.5 h-3.5 text-indigo-400" />
            <span>{report.upvotes} Upvotes</span>
          </button>
        </div>

        {/* Multimodal Analysis Block */}
        {analysis ? (
          <div className="flex flex-col gap-5">
            {/* Classification Highlight Card - Bento grid block */}
            <div className="bg-indigo-600 rounded-2xl p-5 flex flex-col justify-between text-white shadow-md relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full pointer-events-none"></div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-80">System Classification</span>
                <Sparkles className="w-5 h-5 text-indigo-200" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight uppercase">{analysis.category || "GENERAL CIVIC"}</h2>
                <p className="text-xs font-mono font-medium opacity-90 mt-0.5">{analysis.subcategory || "Standard Infrastructure Task"}</p>
              </div>
            </div>

            {/* Severity Index (Bento Box styled) */}
            <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-3 shadow-inner">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Severity Index</span>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  Confidence: {(analysis.confidence_score * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black text-amber-500 tracking-tighter">
                  {getSeverityScoreAndPercent(analysis.severity).score}
                </span>
                <span className="text-zinc-500 mb-1.5 font-bold text-sm">/10</span>
                <span className={`ml-auto font-bold text-xs px-2 py-0.5 rounded uppercase tracking-wider ${
                  analysis.severity === "Critical" || analysis.severity === "High"
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}>
                  {analysis.severity} priority
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-500" 
                  style={{ width: getSeverityScoreAndPercent(analysis.severity).percent }}
                ></div>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                {analysis.severity === "Critical" || analysis.severity === "High"
                  ? "Immediate remediation recommended. High-density residential zone risk vectors active."
                  : "Standard queue processing. No immediate threat to vehicular or pedestrian safety."}
              </p>
            </div>

            {/* Metadata Extraction Dashboard */}
            <div className="bg-zinc-950/40 border border-zinc-850/40 rounded-xl p-5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-4">Metadata Extraction</span>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <div>
                  <p className="text-[9px] text-zinc-500 uppercase font-mono">Dimensions</p>
                  <p className="text-xs font-mono font-bold text-zinc-300">{analysis.visual_analysis.approximate_dimensions}</p>
                </div>
                <div>
                  <p className="text-[9px] text-zinc-500 uppercase font-mono">Weather Condition</p>
                  <p className="text-xs font-mono text-zinc-300">{analysis.contextual_clues.weather_condition}</p>
                </div>
                <div>
                  <p className="text-[9px] text-zinc-500 uppercase font-mono">OCR Content</p>
                  <p className="text-xs font-mono italic text-indigo-400 truncate">{analysis.contextual_clues.ocr_text || '"N/A"'}</p>
                </div>
                <div>
                  <p className="text-[9px] text-zinc-500 uppercase font-mono">Grid Coordinates</p>
                  <p className="text-xs font-mono text-zinc-300">{report.latitude.toFixed(4)}° N, {report.longitude.toFixed(4)}° W</p>
                </div>
              </div>

              {/* Detected elements tag block */}
              <div className="flex flex-wrap gap-1.5 pt-4 mt-3 border-t border-zinc-800/40">
                {analysis.visual_analysis.detected_elements.map((elem: string, i: number) => (
                  <span key={i} className="bg-zinc-950 border border-zinc-800 text-zinc-400 text-[9px] font-mono px-2 py-0.5 rounded-md">
                    #{elem.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Hazard Profile Block */}
            <div className="bg-zinc-950/30 border border-zinc-850/30 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-start gap-2.5 text-xs">
                <Eye className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-zinc-300">Hazard Profile</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{analysis.visual_analysis.hazard_level}</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-xs">
                <Activity className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-zinc-300">Landmarks Detected</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">{analysis.contextual_clues.landmarks.join(", ") || "No major landmarks"}</div>
                </div>
              </div>
            </div>

            {/* Agentic Routing Console */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                    Agentic Dispatch Protocol
                  </span>
                </div>
                <span className="bg-indigo-500/10 border border-indigo-500/20 rounded px-1.5 py-0.5 text-[9px] font-mono text-indigo-400 font-bold">
                  {analysis.agentic_actions.municipality_dispatch_payload.priority_code}
                </span>
              </div>

              <div className="text-[11px] flex flex-col gap-2">
                <div>
                  <span className="text-zinc-500 font-mono text-[9px] uppercase block">Dispatch Agency</span>
                  <span className="text-zinc-200 font-bold">{analysis.agentic_actions.municipality_dispatch_payload.department}</span>
                </div>
                <div>
                  <span className="text-zinc-500 font-mono text-[9px] uppercase block">Remediation Directives</span>
                  <span className="text-zinc-400 leading-relaxed block mt-0.5 font-mono text-[10px]">
                    {analysis.agentic_actions.municipality_dispatch_payload.remediation_instructions}
                  </span>
                </div>
              </div>
            </div>

            {/* Citizen Reward calculus Card */}
            <div className="bg-emerald-500 rounded-2xl p-5 flex flex-col justify-between text-zinc-950 shadow-md">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-70 font-mono">Reward Calculus</span>
              <div className="flex items-center gap-3 my-2">
                <span className="text-4xl font-black tracking-tighter">+{analysis.gamification.xp_rewarded}</span>
                <div className="bg-zinc-950 text-emerald-500 text-[9px] font-mono font-bold px-2 py-1 rounded">CIVIC XP</div>
              </div>
              <p className="text-xs font-bold leading-tight">
                Unlocked Badge: <span className="underline">{analysis.gamification.badge_unlocked}</span>. Complex issue verified reporter bonus applied.
              </p>
            </div>

            {/* Community Verification Action */}
            <div className="bg-zinc-950/20 border border-zinc-850/20 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-400 uppercase">
                <ShieldCheck className="w-4 h-4" />
                Citizen Verification Prompt
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed font-semibold">
                "{analysis.agentic_actions.community_verification_prompt}"
              </p>

              {report.status !== "Resolved" ? (
                <button
                  onClick={handleVerifyClick}
                  disabled={verifying}
                  className="mt-1 w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 shadow"
                >
                  {verifying ? (
                    <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Complete Local Task</span>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                    </>
                  )}
                </button>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ISSUE COMPLETELY RESOLVED
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-6 text-center text-zinc-500 font-mono text-xs flex flex-col items-center gap-2">
            <Sparkles className="w-5 h-5 text-zinc-600 animate-pulse" />
            Generating dynamic AI multimodal metadata...
          </div>
        )}
      </div>
    </div>
  );
}
