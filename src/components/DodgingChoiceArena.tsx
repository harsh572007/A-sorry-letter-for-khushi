import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFX } from '../utils/sound';

interface DodgingChoiceArenaProps {
  allowLabel: string;
  dodgeLabel: string;
  dodgeMessages: string[];
  allowSelected: boolean;
  onAllow: () => void;
  onDodge?: (count: number) => void;
}

export function DodgingChoiceArena({
  allowLabel,
  dodgeLabel,
  dodgeMessages,
  allowSelected,
  onAllow,
  onDodge,
}: DodgingChoiceArenaProps) {
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const dodgeBtnRef = useRef<HTMLButtonElement | null>(null);
  const allowBtnRef = useRef<HTMLButtonElement | null>(null);

  const lastDodgeTsRef = useRef(0);
  const [hasDodged, setHasDodged] = useState(false);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset dodge position if window resizes so the floating button stays inside bounds
  useEffect(() => {
    const handleResize = () => {
      if (!hasDodged) return;
      setHasDodged(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasDodged]);

  const moveButtonInsideBounds = useCallback(() => {
    if (allowSelected) return;
    const now = Date.now();
    if (now - lastDodgeTsRef.current < 120) return;
    lastDodgeTsRef.current = now;

    soundFX.playPop();

    const arena = arenaRef.current;
    const dodgeBtn = dodgeBtnRef.current;
    if (!arena || !dodgeBtn) return;

    const arenaRect = arena.getBoundingClientRect();
    const btnRect = dodgeBtn.getBoundingClientRect();
    const allowRect = allowBtnRef.current?.getBoundingClientRect();

    const pad = 10;
    const effectiveWidth = hasDodged ? btnRect.width : Math.min(btnRect.width, 185);
    const maxX = Math.max(pad, arenaRect.width - effectiveWidth - pad);
    const maxY = Math.max(pad, arenaRect.height - btnRect.height - pad);

    let nextX = pad + Math.random() * (maxX - pad);
    let nextY = pad + Math.random() * (maxY - pad);

    // Try a few times to avoid landing directly over the favorable button or the current spot
    for (let attempt = 0; attempt < 8; attempt++) {
      const candX = pad + Math.random() * (maxX - pad);
      const candY = pad + Math.random() * (maxY - pad);

      const distFromPrev = Math.hypot(candX - pos.x, candY - pos.y);
      let overlapsAllow = false;

      if (allowRect) {
        const allowRelLeft = allowRect.left - arenaRect.left;
        const allowRelTop = allowRect.top - arenaRect.top;
        const horizOverlap =
          candX < allowRelLeft + allowRect.width + 8 &&
          candX + effectiveWidth + 8 > allowRelLeft;
        const vertOverlap =
          candY < allowRelTop + allowRect.height + 8 &&
          candY + btnRect.height + 8 > allowRelTop;
        overlapsAllow = horizOverlap && vertOverlap;
      }

      if (!overlapsAllow && distFromPrev > 44) {
        nextX = candX;
        nextY = candY;
        break;
      }
    }

    const nextCount = dodgeCount + 1;
    setHasDodged(true);
    setPos({ x: nextX, y: nextY });
    setDodgeCount(nextCount);
    onDodge?.(nextCount);
  }, [allowSelected, dodgeCount, hasDodged, onDodge, pos.x, pos.y]);

  const teaseLine =
    dodgeCount > 0 ? dodgeMessages[(dodgeCount - 1) % dodgeMessages.length] : null;

  return (
    <div className="mt-6">
      {/* Bounded Play Arena — guaranteed inside visible screen on mobile & desktop */}
      <div
        ref={arenaRef}
        className="relative min-h-[210px] w-full overflow-hidden rounded-2xl border border-[#6E4534]/10 bg-[#FDF8F3]/80 p-4 sm:min-h-[184px]"
      >
        {/* Favorable button stays grounded and easy to tap */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <motion.button
            ref={allowBtnRef}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onAllow}
            className={`relative z-10 min-h-[52px] w-full rounded-2xl border px-5 py-3.5 text-center text-sm font-semibold transition-all sm:w-auto sm:min-w-[195px] focus-visible:outline-2 focus-visible:outline-[#4A2C20] ${
              allowSelected
                ? 'border-[#6E4534] bg-[#6E4534] text-[#FDF8F3] shadow-md'
                : 'border-[#6E4534]/25 bg-[#6E4534] text-[#FDF8F3] shadow-sm hover:bg-[#4A2C20]'
            }`}
          >
            {allowLabel}
          </motion.button>

          {/* Unfavorable button: starts cleanly beside it, then floats inside arena bounds */}
          {!allowSelected && (
            <motion.button
              ref={dodgeBtnRef}
              type="button"
              onMouseEnter={moveButtonInsideBounds}
              onPointerDown={(e) => {
                if (e.pointerType !== 'mouse') {
                  e.preventDefault();
                  moveButtonInsideBounds();
                }
              }}
              onClick={(e) => {
                e.preventDefault();
                moveButtonInsideBounds();
              }}
              animate={
                hasDodged
                  ? {
                      x: pos.x,
                      y: pos.y,
                    }
                  : { x: 0, y: 0 }
              }
              transition={{ type: 'spring', stiffness: 520, damping: 28 }}
              style={
                hasDodged
                  ? { position: 'absolute', top: 0, left: 0, zIndex: 20 }
                  : { position: 'relative', zIndex: 20 }
              }
              className={`min-h-[50px] shrink-0 cursor-pointer rounded-2xl border border-[#C98A8B]/55 bg-[#FDF8F3] px-5 py-3 text-center text-sm font-semibold whitespace-nowrap text-[#4A2C20] shadow-sm select-none hover:bg-[#FAF2E8] ${
                hasDodged ? 'w-auto' : 'w-full sm:w-auto sm:min-w-[175px]'
              }`}
            >
              {dodgeLabel}
            </motion.button>
          )}
        </div>

        {/* Cute teasing whisper inside the arena */}
        <AnimatePresence mode="wait">
          {teaseLine && !allowSelected && (
            <motion.p
              key={dodgeCount}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              className="pointer-events-none mt-16 text-center text-xs font-medium text-[#6E4534]/85 sm:mt-10"
            >
              {teaseLine}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
