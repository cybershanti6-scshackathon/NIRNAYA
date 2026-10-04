import { useEffect } from "react";
import { useSim } from "../../store/sim";

const toneClass: Record<string, string> = {
  info: "border-sky-500/40 text-sky-200",
  ok: "border-emerald-500/40 text-emerald-200",
  warn: "border-amber-500/40 text-amber-200",
};

export function Toasts() {
  const { toasts, dismissToast } = useSim();
  useEffect(() => {
    if (toasts.length === 0) return;
    const t = setTimeout(() => dismissToast(toasts[0].id), 3200);
    return () => clearTimeout(t);
  }, [toasts, dismissToast]);
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={`glass rounded-xl border px-4 py-3 text-sm shadow-xl animate-fade-in-up ${toneClass[t.tone]}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
