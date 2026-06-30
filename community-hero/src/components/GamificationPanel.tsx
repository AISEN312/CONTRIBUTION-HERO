import React from "react";
import { Award, Zap, Flame, Trophy, ShieldAlert, Sparkles, UserCheck } from "lucide-react";

interface GamificationPanelProps {
  userXP: number;
  unlockedBadges: string[];
}

export default function GamificationPanel({ userXP, unlockedBadges }: GamificationPanelProps) {
  // Gamification logic
  const xpPerLevel = 100;
  const currentLevel = Math.floor(userXP / xpPerLevel) + 1;
  const currentLevelXP = userXP % xpPerLevel;
  const progressPercent = Math.min((currentLevelXP / xpPerLevel) * 100, 100);

  // Available badges metadata
  const badgesList = [
    {
      id: "Road Warrior",
      title: "Road Warrior",
      description: "Successfully identified high-priority public works & potholes",
      icon: Award,
      color: "bg-indigo-500/10 border-indigo-500 text-indigo-400",
      unlockedColor: "bg-indigo-600 text-white",
    },
    {
      id: "Spark Ranger",
      title: "Spark Ranger",
      description: "Reported municipal grid power failure or dark streetlights",
      icon: Zap,
      color: "bg-amber-500/10 border-amber-500 text-amber-400",
      unlockedColor: "bg-amber-400 text-zinc-950",
    },
    {
      id: "Sanitation Sentinel",
      title: "Sanitation Sentinel",
      description: "Resolved waste disposal or public bin overflows",
      icon: Flame,
      color: "bg-emerald-500/10 border-emerald-500 text-emerald-400",
      unlockedColor: "bg-emerald-400 text-zinc-950",
    },
    {
      id: "Hydrologist Pro",
      title: "Hydrologist Pro",
      description: "Identified blocked stormwater sewers or water line leaks",
      icon: UserCheck,
      color: "bg-sky-500/10 border-sky-500 text-sky-400",
      unlockedColor: "bg-sky-400 text-zinc-950",
    },
  ];

  // Dummy leader board
  const leaderboard = [
    { rank: 1, name: "Sarah K. (Central)", xp: 340, badge: "Grand Sentinel" },
    { rank: 2, name: "Marcus T. (East)", xp: 280, badge: "Road Guru" },
    { rank: 3, name: "You", xp: userXP, badge: unlockedBadges[0] || "Novice Hero", isSelf: true },
    { rank: 4, name: "David L. (North)", xp: 120, badge: "Eco Cadet" },
    { rank: 5, name: "Elena R. (South)", xp: 80, badge: "Civic Scout" },
  ];

  // Sort leader board dynamically by XP
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.xp - a.xp);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl flex flex-col gap-6">
      {/* Level Card */}
      <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800/80 rounded-xl p-4 flex items-center justify-between shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 bg-indigo-500/5 rounded-full blur-2xl"></div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-mono font-bold tracking-widest uppercase mb-1">
            <Sparkles className="w-3 h-3" />
            Civic Profile
          </div>
          <h3 className="font-bold text-zinc-100 text-lg leading-tight">Civic Defender</h3>
          <p className="text-xs text-zinc-400 mb-3">Keep reporting to protect your neighborhood!</p>

          {/* Progress Bar */}
          <div className="w-full bg-zinc-850 rounded-full h-2.5 overflow-hidden mb-1 border border-zinc-800">
            <div
              className="bg-gradient-to-r from-indigo-500 to-indigo-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>{currentLevelXP} / {xpPerLevel} XP</span>
            <span>Level {currentLevel + 1}</span>
          </div>
        </div>

        {/* Level Badge */}
        <div className="ml-4 bg-indigo-500/10 border-2 border-indigo-500 rounded-xl px-4 py-3 text-center flex flex-col justify-center items-center shadow-lg min-w-[70px]">
          <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold tracking-wider">Level</span>
          <span className="text-3xl font-bold text-zinc-100 leading-none">{currentLevel}</span>
        </div>
      </div>

      {/* Badges and Trophies */}
      <div>
        <h4 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Unlocked Neighborhood Achievements ({unlockedBadges.length} / {badgesList.length})
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {badgesList.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.id);
            const IconComponent = badge.icon;

            return (
              <div
                key={badge.id}
                className={`border rounded-xl p-3 flex flex-col gap-2 transition-all duration-300 relative ${
                  isUnlocked
                    ? "bg-zinc-950/40 border-zinc-700 shadow-md"
                    : "bg-zinc-950/20 border-zinc-800/60 opacity-40 select-none"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg border ${isUnlocked ? badge.color : "bg-zinc-900 border-zinc-800 text-zinc-600"}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-xs text-zinc-200 truncate">{badge.title}</span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed min-h-[30px]">{badge.description}</p>
                {isUnlocked && (
                  <div className="absolute top-2 right-2 flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 rounded-full p-0.5 text-[8px] font-mono text-indigo-400 px-1">
                    ACTIVE
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hyperlocal Leaderboard */}
      <div className="border-t border-zinc-800/80 pt-4">
        <h4 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-indigo-400" />
          District Leaderboard
        </h4>
        <div className="flex flex-col gap-1.5">
          {sortedLeaderboard.map((hero, idx) => (
            <div
              key={hero.name}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                hero.isSelf
                  ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-100 font-semibold shadow-sm"
                  : "bg-zinc-950/30 border-zinc-850/40 text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-5 h-5 font-mono text-[10px] flex items-center justify-center rounded-md font-bold ${
                  idx === 0
                    ? "bg-indigo-500 text-white"
                    : idx === 1
                    ? "bg-zinc-700 text-zinc-100"
                    : "bg-zinc-800 text-zinc-400"
                }`}>
                  #{idx + 1}
                </span>
                <div>
                  <div className="font-medium truncate max-w-[120px]">{hero.name}</div>
                  <div className="text-[9px] text-zinc-400 truncate">{hero.badge}</div>
                </div>
              </div>
              <div className="text-right font-mono text-xs text-zinc-100">
                {hero.xp} <span className="text-[10px] text-zinc-500">XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
