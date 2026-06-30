import React from "react";
import { CivicReport } from "../types";
import { MapPin, ZoomIn, Compass } from "lucide-react";

interface NeighborhoodMapProps {
  reports: CivicReport[];
  selectedReport: CivicReport | null;
  onSelectReport: (report: CivicReport) => void;
}

export default function NeighborhoodMap({
  reports,
  selectedReport,
  onSelectReport,
}: NeighborhoodMapProps) {
  // Map dimensions
  const mapWidth = 500;
  const mapHeight = 350;

  // Map boundaries (latitude / longitude scale)
  const minLat = 37.765;
  const maxLat = 37.795;
  const minLng = -122.435;
  const maxLng = -122.405;

  const getCoordinates = (lat: number, lng: number) => {
    // Linear interpolation from lat/lng to SVG space
    const x = ((lng - minLng) / (maxLng - minLng)) * mapWidth;
    const y = mapHeight - ((lat - minLat) / (maxLat - minLat)) * mapHeight;
    return { x, y };
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400 animate-spin-slow" />
            Hyperlocal Virtual Map
          </h3>
          <p className="text-xs text-zinc-400">Maplewood District Live Tracking Grid</p>
        </div>
        <div className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
          CTR: 37.7795° N, 122.4230° W
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full aspect-video md:aspect-auto md:flex-1 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden min-h-[260px]">
        {/* Map Grid Lines */}
        <svg
          className="absolute inset-0 w-full h-full text-zinc-900"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* District Outline Paths */}
          <path
            d="M 50,100 Q 150,80 250,130 T 450,90 L 420,300 Q 200,320 80,260 Z"
            fill="url(#glow)"
            stroke="rgba(99, 102, 241, 0.2)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Primary Roadways (Abstract Lines) */}
          <line x1="0" y1="120" x2="500" y2="180" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="8" />
          <line x1="180" y1="0" x2="220" y2="350" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="6" />
          <line x1="380" y1="0" x2="350" y2="350" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="5" />
          <line x1="0" y1="280" x2="500" y2="240" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="4" />

          {/* Secondary Street Textures */}
          <text x="30" y="145" className="fill-zinc-700 text-[9px] font-mono select-none uppercase tracking-widest font-semibold">Grand Boulevard</text>
          <text x="210" y="330" className="fill-zinc-700 text-[9px] font-mono select-none uppercase tracking-widest font-semibold rotate-90 origin-left">4th Ave</text>
          <text x="360" y="330" className="fill-zinc-700 text-[9px] font-mono select-none uppercase tracking-widest font-semibold rotate-90 origin-left">Elm St</text>

          {/* Selected report connection line */}
          {selectedReport && (
            (() => {
              const { x, y } = getCoordinates(selectedReport.latitude, selectedReport.longitude);
              return (
                <g>
                  {/* Glowing focus ring */}
                  <circle
                    cx={x}
                    cy={y}
                    r="24"
                    fill="none"
                    stroke="rgba(99, 102, 241, 0.4)"
                    strokeWidth="1"
                    className="animate-ping"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill="none"
                    stroke="rgb(99, 102, 241)"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })()
          )}
        </svg>

        {/* Dynamic Interactive Report Markers */}
        {reports.map((report) => {
          const { x, y } = getCoordinates(report.latitude, report.longitude);
          const isSelected = selectedReport?.id === report.id;
          
          // Map category colors
          let pinColor = "text-indigo-400 bg-indigo-950 border-indigo-500";
          if (report.analysis?.category === "Electrical/Streetlights") {
            pinColor = "text-amber-400 bg-amber-950 border-amber-400";
          } else if (report.analysis?.category === "Water & Sanitation") {
            pinColor = "text-sky-400 bg-sky-950 border-sky-400";
          } else if (report.analysis?.category === "Waste Management") {
            pinColor = "text-emerald-400 bg-emerald-950 border-emerald-400";
          } else if (report.analysis?.category === "Public Safety") {
            pinColor = "text-red-400 bg-red-950 border-red-400";
          }

          return (
            <button
              key={report.id}
              onClick={() => onSelectReport(report)}
              style={{
                left: `${(x / mapWidth) * 100}%`,
                top: `${(y / mapHeight) * 100}%`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full border-2 transition-all duration-300 shadow-lg cursor-pointer ${
                isSelected
                  ? "scale-125 z-30 ring-4 ring-indigo-500/30"
                  : "scale-100 z-20 hover:scale-115 hover:z-25"
              } ${pinColor}`}
              title={report.title}
            >
              <MapPin className="w-4 h-4" />
            </button>
          );
        })}

        {/* Map Legend */}
        <div className="absolute bottom-3 left-3 bg-zinc-950/90 border border-zinc-800 rounded-lg p-2.5 flex flex-col gap-1 text-[10px] text-zinc-300 font-mono backdrop-blur-sm shadow-md">
          <div className="font-semibold text-zinc-400 border-b border-zinc-800 pb-1 mb-1">Grid Legend</div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/20 border border-indigo-500 inline-block"></span>
            <span>Public Works</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/20 border border-amber-400 inline-block"></span>
            <span>Streetlights</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400/20 border border-sky-400 inline-block"></span>
            <span>Water & Sanitation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/20 border border-emerald-400 inline-block"></span>
            <span>Waste Management</span>
          </div>
        </div>
      </div>
    </div>
  );
}
