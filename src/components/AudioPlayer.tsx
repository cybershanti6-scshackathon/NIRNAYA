import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

export function AudioPlayer({ src, durationHint, onPlay }: { src: string; durationHint?: string; onPlay?: () => void }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const onTime = () => setCur(a.currentTime);
    const onMeta = () => setDur(a.duration || 0);
    const onEnd = () => { setPlaying(false); setCur(0); a.currentTime = 0; };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, [src]);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => {
        setPlaying(true);
        onPlay?.();
      }).catch(() => {});
    }
  };

  const replay = () => {
    const a = ref.current;
    if (!a) return;
    a.currentTime = 0;
    setCur(0);
    a.play().then(() => {
      setPlaying(true);
      onPlay?.();
    }).catch(() => {});
  };

  const seek = (v: number) => {
    const a = ref.current;
    if (!a) return;
    a.currentTime = v;
    setCur(v);
  };

  const f = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">
      <audio ref={ref} src={src} preload="metadata" />
      <button
        onClick={toggle}
        className="grid h-7 w-7 place-items-center rounded-full bg-[#556b2f]/40 text-[#d3e2b3] hover:bg-[#556b2f]/60 transition shrink-0"
        aria-label={playing ? "Pause" : "Play"}
        title={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause size={13} /> : <Play size={13} />}
      </button>
      <button
        onClick={replay}
        className="grid h-7 w-7 place-items-center rounded-full bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition shrink-0"
        aria-label="Replay audio"
        title="Replay from start"
      >
        <RotateCcw size={12} />
      </button>
      <input
        type="range"
        min={0}
        max={Math.max(dur, 0.1)}
        step={0.05}
        value={cur}
        onChange={(e) => seek(Number(e.target.value))}
        className="flex-1 accent-[#9caf88] h-1"
        aria-label="Seek audio position"
      />
      <span className="font-mono text-[10px] text-slate-400 w-20 text-right shrink-0">
        {f(cur)} / {dur ? f(dur) : durationHint ?? "--:--"}
      </span>
    </div>
  );
}
