import { useState } from "react";
import { useSim } from "../../store/sim";
import { getAARData, downloadAARPdf } from "../../utils/pdf";

export function AAR() {
  const { pushToast } = useSim();
  const [data, setData] = useState<ReturnType<typeof getAARData> | null>(null);

  const generate = () => {
    setData(getAARData());
    pushToast("AAR compiled from current scenario data.", "ok");
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <h2 className="font-display text-xl font-bold tracking-widest text-white">AFTER ACTION REVIEW</h2>
      <p className="text-sm text-muted -mt-2">Compiled from the live scenario: timeline, decisions, communications, reports and performance.</p>
      <div className="panel p-5 space-y-4">
        {!data && <p className="text-sm text-slate-500">No AAR generated yet. Start a scenario, run it for a while, then generate the review.</p>}
        {data && (
          <>
            <div>
              <p className="text-xs font-bold tracking-widest text-[#b7c79a]">AAR HEADER</p>
              <div className="mt-1 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-300">
                <p><span className="text-muted">Operation:</span> {data.header.operation}</p>
                <p><span className="text-muted">Domain:</span> {data.header.domain}</p>
                <p><span className="text-muted">Role:</span> {data.header.role}</p>
                <p><span className="text-muted">Date:</span> {data.header.date}</p>
                <p><span className="text-muted">Duration:</span> {data.header.duration}</p>
                <p><span className="text-muted">Participant:</span> {data.header.participant}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest text-[#b7c79a]">OPERATION SUMMARY</p>
              <p className="text-sm text-slate-300">Objective: {data.summary.objective}</p>
              <p className="text-sm text-slate-300">Initial situation: {data.summary.initial}</p>
              <p className="text-sm text-slate-300">Final outcome: {data.summary.outcome}</p>
              <ul className="mt-1 text-xs text-slate-400 list-disc pl-5">{data.summary.major.map((m, i) => <li key={i}>{m}</li>)}</ul>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest text-[#b7c79a]">TIMELINE</p>
              <div className="max-h-40 overflow-y-auto text-xs text-slate-400 font-mono">
                {[...data.timeline].reverse().map((t, i) => <p key={i}>{t}</p>)}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest text-[#b7c79a]">DECISION LOG</p>
              {data.decisions.length === 0 ? <p className="text-xs text-slate-500">No decisions recorded.</p> : data.decisions.map((d, i) => (
                <p key={i} className="text-xs text-slate-400"><span className="font-mono text-emerald-400">{d.time}</span> — {d.option} | confidence {d.confidence} | affected: {d.affected} | {d.reason}</p>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest text-[#b7c79a]">COMMUNICATION LOG</p>
              {data.commLog.length === 0 ? <p className="text-xs text-slate-500">No communication events recorded.</p> : data.commLog.map((c, i) => (
                <p key={i} className="text-xs text-slate-400"><span className="font-mono text-emerald-400">{c.time}</span> — {c.from} → {c.to} | {c.type} | {c.status}</p>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest text-[#b7c79a]">PERFORMANCE</p>
              {data.performance.map(([k, v, score]) => (
                <p key={k} className="text-xs text-slate-400">{k}: {v} — <span className="text-emerald-300 font-mono">{score}%</span></p>
              ))}
              <p className="mt-1 text-sm font-bold text-white">Overall Performance: <span className="text-emerald-300">{data.overall}%</span></p>
            </div>
          </>
        )}
      </div>
      <div className="flex gap-3">
        <button className="btn-primary" onClick={generate}>GENERATE AAR</button>
        <button className="btn-ghost" onClick={() => { downloadAARPdf(); pushToast("AAR PDF exported.", "ok"); }}>EXPORT AAR REPORT (PDF)</button>
      </div>
    </div>
  );
}
