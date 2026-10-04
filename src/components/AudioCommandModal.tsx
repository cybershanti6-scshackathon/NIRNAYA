import { useEffect, useState } from "react";
import { Mic, Play, Send, Square } from "lucide-react";
import { Modal } from "./ui/common";
import { useSim } from "../store/sim";

export function AudioCommandModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { teams, pushToast, domain } = useSim();
  const firstClip = domain ? `/audio/${domain.toLowerCase()}/msg01.wav` : "/audio/air/msg01.wav";
  const [recipient, setRecipient] = useState("TEAM ALPHA");
  const [message, setMessage] = useState("");
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  const send = () => {
    setSent(true);
    pushToast(`Simulated audio command sent to ${recipient}.`, "ok");
    setTimeout(() => { setSent(false); setSeconds(0); setMessage(""); onClose(); }, 900);
  };

  return (
    <Modal open={open} onClose={onClose} title="SEND AUDIO COMMAND">
      <div className="space-y-4">
        <label className="block text-xs text-muted">Recipient
          <select className="input mt-1" value={recipient} onChange={(e) => setRecipient(e.target.value)}>
            {teams.map((t) => <option key={t.id}>{t.name}</option>)}
          </select>
        </label>
        <label className="block text-xs text-muted">Message (simulated)
          <input className="input mt-1" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g. Hold position and report status" />
        </label>
        <div>
          <p className="text-xs text-muted mb-1">Simulated waveform</p>
          <div className="flex h-14 items-center gap-1 rounded-xl border border-white/10 bg-black/30 px-3">
            {Array.from({ length: 40 }).map((_, i) => (
              <span key={i} className={`w-1 rounded-full ${recording ? "bg-emerald-400" : "bg-slate-700"}`} style={{ height: `${recording ? 20 + Math.abs(Math.sin(i + seconds * 2)) * 60 : 15}%`, transition: "height .2s" }} />
            ))}
            <span className="ml-auto font-mono text-xs text-slate-400">00:{String(seconds).padStart(2, "0")}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {!recording ? (
            <button className="btn-primary flex-1" onClick={() => { setRecording(true); setSeconds(0); }}><Mic size={15} /> RECORD</button>
          ) : (
            <button className="btn-ghost flex-1 !border-red-500/50 text-red-300" onClick={() => setRecording(false)}><Square size={15} /> STOP</button>
          )}
          <button className="btn-ghost" onClick={() => { const a = new Audio(firstClip); a.play().catch(() => {}); pushToast("Playing last transmitted audio command.", "info"); }}><Play size={15} /></button>
          <button className="btn-primary flex-1 !bg-gradient-to-r !from-[#556b2f] !to-[#6b8e23]" onClick={send} disabled={sent}><Send size={15} /> {sent ? "SENT" : "SEND"}</button>
        </div>
        <p className="text-[10px] text-slate-500">Command is logged to the current training scenario.</p>
      </div>
    </Modal>
  );
}
