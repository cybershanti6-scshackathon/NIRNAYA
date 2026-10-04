// Generates local demo audio assets (radio-style voice bursts) for the simulation.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SR = 8000;
const domains = ["air", "land", "cyber", "ew"];
const root = new URL("../public/audio", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

function wavHeader(dataLen) {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + dataLen, 4); h.write("WAVE", 8);
  h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(dataLen, 40);
  return h;
}

// deterministic pseudo-random per (domainIndex, msgIndex)
function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function synth(domainIdx, msgIdx) {
  const r = rng(domainIdx * 1000 + msgIdx * 77 + 13);
  const dur = 2.2 + (msgIdx % 4) * 0.6;
  const n = Math.floor(SR * dur);
  const base = 110 + Math.floor(r() * 90);
  const data = new Int16Array(n);
  let syllable = 0, gate = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    // syllable gating to mimic speech cadence
    if (i % Math.floor(SR * 0.14) === 0) { gate = r() > 0.35 ? 1 : 0; syllable = 0.6 + r() * 0.8; }
    const freq = base * syllable;
    let v = 0;
    v += 0.5 * Math.sin(2 * Math.PI * freq * t);
    v += 0.25 * Math.sin(2 * Math.PI * freq * 2.02 * t);
    v += 0.12 * Math.sin(2 * Math.PI * freq * 3.01 * t);
    v *= gate;
    // radio static
    v += (r() * 2 - 1) * 0.06;
    // envelope
    const env = Math.min(1, Math.min(i, n - i) / (SR * 0.08));
    // beep signaling at start/end
    if (t < 0.08 || t > dur - 0.08) v += 0.35 * Math.sin(2 * Math.PI * 1250 * t);
    data[i] = Math.max(-1, Math.min(1, v * 0.55 * env)) * 32767;
  }
  const buf = Buffer.alloc(n * 2);
  for (let i = 0; i < n; i++) buf.writeInt16LE(data[i], i * 2);
  return Buffer.concat([wavHeader(buf.length), buf]);
}

for (const [di, d] of domains.entries()) {
  const dir = join(root, d);
  mkdirSync(dir, { recursive: true });
  for (let i = 1; i <= 10; i++) {
    writeFileSync(join(dir, `msg${String(i).padStart(2, "0")}.wav`), synth(di, i));
  }
}
console.log("Audio generated at", root);
