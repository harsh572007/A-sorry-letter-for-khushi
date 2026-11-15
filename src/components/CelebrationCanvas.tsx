import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  color: string;
  shape: 'confetti' | 'heart' | 'star' | 'petal';
  alpha: number;
  decay: number;
}

interface CelebrationCanvasProps {
  burstKey: number;
  intensity?: 'gentle' | 'grand';
}

const PALETTE = ['#B6794C', '#C98A8B', '#A294B8', '#8BA389', '#6E4534', '#E5B28A', '#D9A7A8'];

export function CelebrationCanvas({ burstKey, intensity = 'grand' }: CelebrationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (burstKey === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const count = intensity === 'grand' ? 110 : 42;
    const shapes: Particle['shape'][] = ['confetti', 'heart', 'star', 'petal'];

    for (let i = 0; i < count; i++) {
      const fromCenter = intensity === 'gentle' || i % 2 === 0;
      const startX = fromCenter ? width * (0.35 + Math.random() * 0.3) : Math.random() * width;
      const startY = fromCenter ? height * 0.45 : -20 - Math.random() * 120;
      const angle = fromCenter ? -Math.PI / 2 + (Math.random() - 0.5) * 1.9 : Math.PI / 2 + (Math.random() - 0.5) * 0.5;
      const speed = fromCenter ? 4 + Math.random() * 8 : 2 + Math.random() * 3.5;

      particlesRef.current.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (fromCenter ? 2 : 0),
        size: 6 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.14,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        alpha: 1,
        decay: intensity === 'grand' ? 0.006 + Math.random() * 0.005 : 0.01 + Math.random() * 0.008,
      });
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawHeart = (c: CanvasRenderingContext2D, s: number) => {
      c.beginPath();
      c.moveTo(0, s * 0.3);
      c.bezierCurveTo(-s * 0.55, -s * 0.3, -s * 0.9, s * 0.25, 0, s * 0.85);
      c.bezierCurveTo(s * 0.9, s * 0.25, s * 0.55, -s * 0.3, 0, s * 0.3);
      c.fill();
    };

    const drawStar = (c: CanvasRenderingContext2D, s: number) => {
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        c.lineTo(Math.cos(angle) * s * 0.7, Math.sin(angle) * s * 0.7);
        c.lineTo(Math.cos(angle + Math.PI / 4) * s * 0.24, Math.sin(angle + Math.PI / 4) * s * 0.24);
      }
      c.closePath();
      c.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.02 && p.y < canvas.height + 60);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.11;
        p.vx *= 0.99;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === 'heart') {
          drawHeart(ctx, p.size);
        } else if (p.shape === 'star') {
          drawStar(ctx, p.size);
        } else if (p.shape === 'petal') {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.65, p.size * 0.35, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size * 0.5, -p.size * 0.25, p.size, p.size * 0.5);
        }
        ctx.restore();
      }

      if (particlesRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(render);
      } else {
        rafRef.current = null;
      }
    };

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(render);
    }

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [burstKey, intensity]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
}
