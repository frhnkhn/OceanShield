"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Activity } from "lucide-react";

export default function DigitalTwinViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [timeStep, setTimeStep] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; color: string }> = [];

    // Initialize particles representing evacuees / rescue boats
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        color: Math.random() > 0.6 ? "#06b6d4" : "#10b981"
      });
    }

    const render = () => {
      if (!ctx || !canvas) return;

      // Dark background
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid grid
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw coastal shoreline boundary line
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.3, 0);
      ctx.bezierCurveTo(
        canvas.width * 0.4, canvas.height * 0.3,
        canvas.width * 0.2, canvas.height * 0.7,
        canvas.width * 0.5, canvas.height
      );
      ctx.stroke();

      // Animate simulated Coastal Inundation / Flood spreads
      const waveRadius = (timeStep * speed * 0.5) % 180;
      ctx.strokeStyle = "rgba(6, 182, 212, 0.15)";
      ctx.fillStyle = "rgba(6, 182, 212, 0.03)";
      ctx.beginPath();
      ctx.arc(canvas.width * 0.35, canvas.height * 0.5, waveRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = "rgba(239, 68, 68, 0.1)";
      ctx.beginPath();
      ctx.arc(canvas.width * 0.35, canvas.height * 0.5, waveRadius * 0.6, 0, Math.PI * 2);
      ctx.stroke();

      // Draw active shelters
      const shelters = [
        { name: "Marina Shelter", x: canvas.width * 0.5, y: canvas.height * 0.3 },
        { name: "Mylapore Post", x: canvas.width * 0.7, y: canvas.height * 0.6 }
      ];

      shelters.forEach(s => {
        ctx.fillStyle = "#6366f1";
        ctx.fillRect(s.x - 6, s.y - 6, 12, 12);
        ctx.strokeStyle = "white";
        ctx.strokeRect(s.x - 6, s.y - 6, 12, 12);
        
        ctx.fillStyle = "#94a3b8";
        ctx.font = "8px monospace";
        ctx.fillText(s.name, s.x - 20, s.y - 10);
      });

      // Render moving evacuee particle nodes
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();

        if (isPlaying) {
          p.x += p.vx * speed;
          p.y += p.vy * speed;

          // Boundary bounce
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        }
      });

      if (isPlaying) {
        setTimeStep(prev => prev + 1);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, speed, timeStep]);

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-950/40 p-5 backdrop-blur-md flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-slate-900 pb-2">
        <h4 className="font-bold text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-cyan-400" /> Digital Twin Simulation Room
        </h4>
        <span className="font-mono text-[9px] text-slate-500">Tsteps: {timeStep}</span>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-slate-900 bg-slate-950">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={240} 
          className="w-full h-auto block" 
        />
        
        <div className="absolute top-3 right-3 rounded bg-black/70 px-2 py-0.5 text-[8px] text-red-400 font-mono flex items-center gap-1 border border-red-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
          SIMULATION ACTIVE
        </div>
      </div>

      {/* Playback scrubbing controls */}
      <div className="flex items-center justify-between gap-4 text-xs">
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(p => !p)}
            className="p-2 rounded bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          
          <button
            onClick={() => setTimeStep(0)}
            className="p-2 rounded bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-[10px] text-slate-500">Speed</span>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="flex-1 accent-cyan-500 h-1 rounded bg-slate-850"
          />
          <span className="font-mono text-[10px] text-white w-6">{speed}x</span>
        </div>
      </div>
    </div>
  );
}
