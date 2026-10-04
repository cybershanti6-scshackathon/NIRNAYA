import { Fragment, useState } from "react";
import { ArrowDown } from "lucide-react";

const DOMAIN_ORDER = ["AIR", "LAND", "CYBER", "EW"] as const;

export function DomainArchitecture({ active }: { active?: string }) {
  const [spacing, setSpacing] = useState(18);

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-stretch justify-center gap-8">
      {/* Vertical domain architecture */}
      <div className="flex flex-col items-center min-w-[140px]">
        {DOMAIN_ORDER.map((d, i) => {
          const isActive = active?.toUpperCase() === d;
          return (
            <Fragment key={d}>
              <div
                className={`w-full rounded-xl border px-6 py-2.5 text-center font-display text-sm font-black tracking-[0.3em] transition ${
                  isActive
                    ? "border-[#9caf88]/60 bg-[#556b2f]/20 text-[#d3e2b3]"
                    : "border-white/10 bg-white/5 text-white"
                }`}
              >
                {d}
              </div>
              {i < DOMAIN_ORDER.length - 1 && (
                <div
                  className="flex flex-col items-center"
                  style={{ height: spacing, minHeight: 10 }}
                >
                  <div className="w-px flex-1 bg-[#9caf88]/40" />
                  <ArrowDown size={14} className="text-[#9caf88] shrink-0" />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>

      {/* Adjustment / control bar */}
      <div className="flex flex-col items-center gap-2 px-1">
        <span className="text-[10px] font-bold tracking-[0.25em] text-slate-400">ADJUST</span>
        <div className="relative w-6 flex-1 min-h-[140px]">
          <input
            type="range"
            min={8}
            max={44}
            step={1}
            value={spacing}
            onChange={(e) => setSpacing(Number(e.target.value))}
            aria-label="Domain architecture spacing"
            className="absolute left-1/2 top-1/2 h-2 bg-slate-700/60 rounded-lg cursor-pointer accent-[#9caf88]"
            style={{ width: 150, transform: "translate(-50%, -50%) rotate(-90deg)" }}
          />
        </div>
        <span className="font-mono text-[10px] text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
          {spacing}px
        </span>
        <span className="text-[10px] font-bold tracking-[0.25em] text-slate-400">SPACING</span>
      </div>
    </div>
  );
}
