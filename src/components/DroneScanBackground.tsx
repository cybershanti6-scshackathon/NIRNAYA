import { useEffect, useRef } from "react";

/**
 * Home Page only: tactical UAV hovering vertically in the upper area +
 * a horizontal scanning ray sweeping left/right across the viewport.
 * Rendered strictly behind UI; theme-aware; reduced-motion safe.
 */
export function DroneScanBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const cssVar = (n: string, fb: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(n).trim() || fb;
    const withAlpha = (c: string, a: number) => c.replace(/[\d.]+\)$/, `${a})`);

    const drawDrone = (x: number, y: number, s: number, t: number, hud: string, themeMul: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.strokeStyle = withAlpha(hud, 0.55 * themeMul);
      ctx.fillStyle = withAlpha(hud, 0.10 * themeMul);
      ctx.lineWidth = 1.2;

      // rotor spin phase
      const spin = t * 0.02;

      // arms
      ctx.beginPath();
      ctx.moveTo(-s * 1.15, -s * 0.55);
      ctx.lineTo(s * 1.15, s * 0.55);
      ctx.moveTo(s * 1.15, -s * 0.55);
      ctx.lineTo(-s * 1.15, s * 0.55);
      ctx.stroke();

      // body
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.55, s * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // camera pod
      ctx.beginPath();
      ctx.arc(0, s * 0.34, s * 0.14, 0, Math.PI * 2);
      ctx.stroke();

      // rotors
      const rotors: [number, number][] = [
        [-s * 1.15, -s * 0.55],
        [s * 1.15, -s * 0.55],
        [-s * 1.15, s * 0.55],
        [s * 1.15, s * 0.55],
      ];
      for (const [rx, ry] of rotors) {
        ctx.save();
        ctx.translate(rx, ry);
        ctx.strokeStyle = withAlpha(hud, 0.35 * themeMul);
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.42, s * 0.09, spin % Math.PI, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = withAlpha(hud, 0.5 * themeMul);
        ctx.beginPath();
        ctx.arc(rx, ry, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const hud = cssVar("--hero-hud", "rgba(62, 201, 167, 0.35)");
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const themeMul = isLight ? 0.55 : 1;

      /* ---- drone: smooth vertical hover in the upper area ---- */
      const hover = (Math.sin(t * 0.00045) + 1) / 2; // 0..1
      const dy = height * (0.10 + hover * 0.16);     // travel range 10%..26%
      const dx = width * (width < 640 ? 0.5 : 0.24);
      const droneScale = width < 640 ? 8 : 12;
      drawDrone(dx, dy, droneScale, t, hud, themeMul);

      // soft beacon glow under drone
      ctx.save();
      ctx.fillStyle = withAlpha(hud, 0.05 * themeMul);
      ctx.beginPath();
      ctx.arc(dx, dy, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      /* ---- horizontal scanning ray sweeping left <-> right ---- */
      const sweep = (Math.sin(t * 0.00028 - Math.PI / 2) + 1) / 2; // 0..1 eased ping-pong
      const sx = sweep * width;
      const beamW = width < 640 ? 26 : 48;

      const grad = ctx.createLinearGradient(sx - beamW, 0, sx + beamW, 0);
      grad.addColorStop(0, withAlpha(hud, 0));
      grad.addColorStop(0.5, withAlpha(hud, 0.14 * themeMul));
      grad.addColorStop(1, withAlpha(hud, 0));
      ctx.fillStyle = grad;
      ctx.fillRect(sx - beamW, 0, beamW * 2, height);

      ctx.strokeStyle = withAlpha(hud, 0.5 * themeMul);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduced.matches) {
      draw(9000); // static frame, no motion
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-70"
      aria-hidden="true"
    />
  );
}
