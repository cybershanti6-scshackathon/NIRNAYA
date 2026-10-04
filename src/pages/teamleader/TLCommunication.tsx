import { useState } from "react";
import { Volume2 } from "lucide-react";
import { useSim } from "../../store/sim";
import { DOMAINS } from "../../data/domains";
import { AudioPlayer } from "../../components/AudioPlayer";

export function TLCommunication() {
  const { messages, addMessage, pushToast, domain, listened, markListened, addAudioLog, teams } = useSim();
  const [to, setTo] = useState("Commander");
  const [text, setText] = useState("");
  const def = domain ? DOMAINS[domain] : null;
  const clipFolder = domain ? domain.toLowerCase() : "air";

  const send = (urgent = false) => {
    if (!text && !urgent) return;
    addMessage({ from: "Team Alpha", to, text: urgent ? "URGENT REQUEST: immediate support required." : text });
    setText("");
    pushToast(urgent ? "Urgent request transmitted." : "Status sent to Commander.", "ok");
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold tracking-widest text-white">COMMUNICATION — {def?.title ?? "OPS"}</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <h3 className="font-display text-xs font-bold tracking-widest text-white mb-3">CHANNELS</h3>
          {teams.map((t) => (
            <div key={t.id} className="flex justify-between border-b border-white/5 py-2 text-sm">
              <span className="text-slate-200">{t.name}</span>
              <span className={`text-xs font-bold ${t.communication === "DEGRADED" || t.communication === "OFFLINE" ? "text-amber-300" : "text-emerald-300"}`}>{t.communication}</span>
            </div>
          ))}
        </div>

        <div className="panel p-5">
          <h3 className="font-display text-xs font-bold tracking-widest text-white mb-3">TEXT MESSAGES — COMMANDER LINK</h3>
          <div className="max-h-48 space-y-2 overflow-y-auto mb-3">
            {messages.length === 0 && <p className="text-xs text-slate-500">No messages yet. Send a status or urgent request below.</p>}
            {messages.map((m) => (
              <p key={m.id} className="text-xs text-slate-400"><span className="font-mono text-emerald-400">{m.time}</span> <span className="font-bold text-slate-200">{m.from} → {m.to}:</span> {m.text}</p>
            ))}
          </div>
          <select className="input mb-2" value={to} onChange={(e) => setTo(e.target.value)}>
            <option>Commander</option><option>Team Alpha</option><option>Team Bravo</option><option>Team Charlie</option>
          </select>
          <div className="flex gap-2">
            <input className="input" placeholder="Send text status…" value={text} onChange={(e) => setText(e.target.value)} />
            <button className="btn-primary" onClick={() => send(false)}>SEND</button>
          </div>
          <button className="mt-2 w-full rounded-xl border border-red-500/40 bg-red-500/10 py-2 text-xs font-bold tracking-widest text-red-300" onClick={() => send(true)}>SUBMIT URGENT REQUEST</button>
        </div>
      </div>

      <div className="panel p-5">
        <h3 className="font-display text-xs font-bold tracking-widest text-white mb-3 flex items-center gap-2"><Volume2 size={14} /> VOICE RECORDINGS — {def?.title ?? "OPS"}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {def?.comms.map((c, i) => {
            const src = `/audio/${clipFolder}/msg${String(i + 1).padStart(2, "0")}.wav`;
            const key = `${clipFolder}-${i}`;
            return (
              <div key={key} className="rounded-xl border border-white/10 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{c.from} → {c.to}</span>
                  <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] tracking-widest text-slate-400">{c.type}</span>
                </div>
                <p className="text-xs text-slate-400 italic">“{c.text}”</p>
                <AudioPlayer src={src} onPlay={() => { markListened(key); addAudioLog({ from: c.from, to: c.to, text: c.text, type: c.type }, "PLAYED"); }} />
                <div className="flex items-center justify-between">
                  <button
                    className="text-[10px] font-bold tracking-widest text-[#9caf88] hover:underline"
                    onClick={() => { markListened(key); addAudioLog({ from: c.from, to: c.to, text: c.text, type: c.type }, "PLAYED"); }}
                  >
                    {listened[key] ? "✓ LISTENED" : "MARK LISTENED"}
                  </button>
                  <span className="text-[10px] text-slate-500">Audio message {i + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
