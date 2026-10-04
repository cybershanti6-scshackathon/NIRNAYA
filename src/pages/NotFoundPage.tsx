import { useNavigate } from "react-router-dom";
import { AlertOctagon, Home } from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070b16] grid-bg p-6 flex flex-col items-center justify-center text-center">
      <div className="panel max-w-md p-8 border-white/10 shadow-2xl">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-500/20 text-red-400 mb-5">
          <AlertOctagon size={36} />
        </span>
        <h1 className="font-display text-2xl font-black tracking-widest text-white mb-2">
          PAGE NOT FOUND
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          The requested operational page does not exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className="btn-primary w-full !bg-gradient-to-r !from-[#556b2f] !to-[#7a9434] inline-flex items-center justify-center gap-2"
        >
          <Home size={16} /> RETURN TO HOME
        </button>
      </div>
    </div>
  );
}
