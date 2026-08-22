"use client";

import { useState } from "react";

type PricePoint = {
  label: string; // ex. "Lun", "18 aug"
  value: number;
};

export default function PriceChartSection({ data }: { data: PricePoint[] }) {
  const [activeIndex, setActiveIndex] = useState(data.length - 1);
  const active = data[activeIndex];

  const width = 700;
  const height = 220;
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.value - min) / range) * height;
    return { x, y };
  });

  const linePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-[2fr_1fr]">
      {/* GRAFIC */}
      <div className="bg-bg p-8">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full cursor-crosshair"
          preserveAspectRatio="none"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * width;
            const nearest = points.reduce((best, p, i) => {
              const dist = Math.abs(p.x - relX);
              const bestDist = Math.abs(points[best].x - relX);
              return dist < bestDist ? i : best;
            }, 0);
            setActiveIndex(nearest);
          }}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={0}
              x2={width}
              y1={height * t}
              y2={height * t}
              stroke="var(--color-line)"
              strokeWidth={1}
            />
          ))}

          <polyline
            points={linePoints}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={2}
          />

          {/* linie verticală de reper pe punctul activ */}
          <line
            x1={points[activeIndex].x}
            x2={points[activeIndex].x}
            y1={0}
            y2={height}
            stroke="var(--color-accent)"
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.5}
          />

          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === activeIndex ? 5 : 3}
              fill={
                i === activeIndex ? "var(--color-accent)" : "var(--color-text)"
              }
              opacity={i === activeIndex ? 1 : 0.4}
            />
          ))}
        </svg>

        {/* etichete zile sub grafic */}
        <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-text/40">
          {data.map((d, i) => (
            <button
              key={d.label}
              onClick={() => setActiveIndex(i)}
              className={i === activeIndex ? "text-accent" : ""}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>{" "}
      {/* BOX — citire valoare curentă */}
      <div className="flex flex-col justify-between bg-panel p-8">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-text/50">
            {active.label}
          </span>
          <p className="mt-3 font-mono text-4xl text-accent">
            {active.value} €
          </p>
        </div>

        <p className="mt-6 max-w-[16rem] font-body text-sm text-text/60">
          Click sau treci cursorul pe grafic pentru a vedea prețul mediu din
          fiecare zi.
        </p>
      </div>
    </div>
  );
}
