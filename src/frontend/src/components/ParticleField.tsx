import { useMemo } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function ParticleField({ count = 24 }: { count?: number }) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (i * 37 + 13) % 100,
      y: (i * 53 + 7) % 100,
      size: 1 + (i % 4) * 0.5,
      duration: 6 + (i % 6) * 2,
      delay: -(i * 0.7),
      opacity: 0.15 + (i % 5) * 0.08,
    }));
  }, [count]);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-primary particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size * 3}px`,
            height: `${p.size * 3}px`,
            opacity: p.opacity,
            ["--duration" as string]: `${p.duration}s`,
            ["--delay" as string]: `${p.delay}s`,
          }}
        />
      ))}
      {/* Connection lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
        aria-hidden="true"
      >
        <title>Quantum grid background</title>
        <defs>
          <pattern
            id="grid"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 64 0 L 0 0 0 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-primary"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}
