import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFX } from '../utils/sound';

interface MiniBurst {
  id: number;
  x: number;
  y: number;
  kind: 'star' | 'heart' | 'petal';
  color: string;
}

const STAR_POSITIONS = [
  { id: 's1', top: '12%', left: '5%', size: 20, delay: '0s' },
  { id: 's2', top: '20%', right: '6%', size: 18, delay: '1.1s' },
  { id: 's3', top: '72%', left: '4%', size: 18, delay: '0.6s' },
  { id: 's4', top: '80%', right: '6%', size: 20, delay: '1.8s' },
];

const FLOWER_POSITIONS = [
  { id: 0, top: '84%', left: '14%', color: '#C98A8B' },
  { id: 1, top: '16%', left: '84%', color: '#A294B8' },
];

export function DreamyBackdrop() {
  const [bursts, setBursts] = useState<MiniBurst[]>([]);
  const [bloomed, setBloomed] = useState<boolean[]>([false, false]);
  const [toastTip, setToastTip] = useState<string | null>(null);

  const spawnBurst = useCallback(
    (x: number, y: number, kind: MiniBurst['kind'], color: string) => {
      const created: MiniBurst[] = Array.from({ length: 4 }, (_, idx) => ({
        id: Date.now() + Math.random() + idx,
        x: x + (Math.random() - 0.5) * 24,
        y: y + (Math.random() - 0.5) * 18,
        kind,
        color,
      }));
      setBursts((prev) => [...prev.slice(-12), ...created]);
    },
    [],
  );

  useEffect(() => {
    if (bursts.length === 0) return;
    const t = setTimeout(() => {
      setBursts((prev) => prev.slice(Math.min(prev.length, 4)));
    }, 650);
    return () => clearTimeout(t);
  }, [bursts]);

  useEffect(() => {
    if (!toastTip) return;
    const t = setTimeout(() => setToastTip(null), 1700);
    return () => clearTimeout(t);
  }, [toastTip]);

  const handleStarTap = (e: React.MouseEvent | React.TouchEvent) => {
    soundFX.playSparkle();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 'star', '#B6794C');
    setToastTip('Make a wish, Khushi ✨');
  };

  const handleFlowerTap = (idx: number, e: React.MouseEvent | React.TouchEvent, color: string) => {
    soundFX.playBloom();
    setBloomed((prev) => prev.map((b, i) => (i === idx ? !b : b)));
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 'petal', color);
    setToastTip('Flower bloomed 🌸');
  };

  const handleHeartTap = (e: React.MouseEvent | React.TouchEvent) => {
    soundFX.playPop();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 'heart', '#C98A8B');
    setToastTip('Tiny heart unlocked 🤎');
  };

  return (
    <>
      {/* Lightweight warm gradient wash + clouds (no heavy GPU blur filters) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        style={{
          background:
            'radial-gradient(circle at 12% 14%, rgba(239,226,208,0.85) 0%, transparent 45%), radial-gradient(circle at 88% 35%, rgba(201,138,139,0.16) 0%, transparent 45%), radial-gradient(circle at 30% 88%, rgba(162,148,184,0.14) 0%, transparent 45%)',
        }}
      >
        <svg
          className="animate-cloud-drift absolute top-14 left-[6%] w-28 text-[#EFE2D0]/75 md:w-40"
          viewBox="0 0 180 80"
          fill="currentColor"
        >
          <path d="M35 66h110c14 0 24-9 24-21 0-11-9-20-20-21-4-13-16-22-30-22-12 0-23 7-28 17-4-2-9-3-14-3-14 0-25 10-26 24-10 2-18 10-18 20 0 4 1 6 2 6z" />
        </svg>
        <svg
          className="animate-cloud-drift absolute bottom-16 right-[5%] w-32 text-[#EFE2D0]/65 md:w-44"
          style={{ animationDelay: '-5s' }}
          viewBox="0 0 180 80"
          fill="currentColor"
        >
          <path d="M35 66h110c14 0 24-9 24-21 0-11-9-20-20-21-4-13-16-22-30-22-12 0-23 7-28 17-4-2-9-3-14-3-14 0-25 10-26 24-10 2-18 10-18 20 0 4 1 6 2 6z" />
        </svg>

        <div
          className="animate-shooting-star absolute top-[18%] left-[18%] h-0.5 w-16 rounded-full bg-gradient-to-r from-transparent via-[#B6794C]/50 to-[#FDF8F3]"
          style={{ transform: 'rotate(25deg)' }}
        />
      </div>

      {/* Tappable decorations */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {STAR_POSITIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-label="Tap sparkling star"
            onClick={handleStarTap}
            style={{ top: s.top, left: s.left, right: s.right, animationDelay: s.delay }}
            className="animate-twinkle pointer-events-auto absolute flex h-11 w-11 items-center justify-center rounded-full text-[#B6794C]/75 transition-transform duration-150 hover:scale-125 active:scale-90"
          >
            <svg width={s.size} height={s.size} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.3 9.7L22 12L14.3 14.3L12 22L9.7 14.3L2 12L9.7 9.7L12 2Z" />
            </svg>
          </button>
        ))}

        <button
          type="button"
          aria-label="Tap floating heart"
          onClick={handleHeartTap}
          className="animate-float-slow pointer-events-auto absolute top-[38%] left-[4%] hidden h-11 w-11 items-center justify-center rounded-full text-[#C98A8B]/75 transition-transform duration-150 hover:scale-125 active:scale-90 sm:flex"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        {FLOWER_POSITIONS.map((fl, idx) => {
          const isBloomed = bloomed[idx];
          return (
            <button
              key={fl.id}
              type="button"
              aria-label="Tap flower to bloom"
              onClick={(e) => handleFlowerTap(idx, e, fl.color)}
              style={{ top: fl.top, left: fl.left, color: fl.color }}
              className="pointer-events-auto absolute hidden h-11 w-11 items-center justify-center rounded-full opacity-80 transition-transform duration-200 hover:scale-120 active:scale-90 md:flex"
            >
              <svg
                width={isBloomed ? 26 : 20}
                height={isBloomed ? 26 : 20}
                viewBox="0 0 32 32"
                className={`transition-transform duration-300 ${isBloomed ? 'rotate-45 scale-110' : ''}`}
              >
                <g fill="currentColor" opacity="0.88">
                  <circle cx="16" cy="7" r="5" />
                  <circle cx="25" cy="16" r="5" />
                  <circle cx="16" cy="25" r="5" />
                  <circle cx="7" cy="16" r="5" />
                </g>
                <circle cx="16" cy="16" r="4" fill="#EFE2D0" />
              </svg>
            </button>
          );
        })}

        <AnimatePresence>
          {bursts.map((b) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0.95, scale: 0.6, x: b.x, y: b.y }}
              animate={{
                opacity: 0,
                scale: 1.25,
                x: b.x + (Math.random() - 0.5) * 28,
                y: b.y - 36,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              style={{ color: b.color }}
              className="pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2"
            >
              {b.kind === 'heart' ? (
                <span className="text-sm">🤎</span>
              ) : b.kind === 'petal' ? (
                <span className="text-sm">🌸</span>
              ) : (
                <span className="text-xs">✨</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toastTip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16 }}
            className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-xl border border-[#6E4534]/15 bg-[#FDF8F3]/95 px-4 py-2 text-xs font-medium text-[#4A2C20] shadow-md"
          >
            {toastTip}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
