import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Heart, Play, RotateCcw } from 'lucide-react';
import { PAGE_5_SMILE_CHALLENGE } from '../../data/messages';
import { soundFX } from '../../utils/sound';
import { IllustrationCard } from '../IllustrationCard';

interface FloatingHeartTarget {
  id: number;
  xPct: number;
  yPct: number;
  speed: number;
  emoji: string;
}

interface ScratchCardProps {
  id: number;
  coverLabel: string;
  hiddenTitle: string;
  hiddenMessage: string;
  alreadyScratched: boolean;
  onComplete: (id: number) => void;
}

function ScratchCard({
  id,
  coverLabel,
  hiddenTitle,
  hiddenMessage,
  alreadyScratched,
  onComplete,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const scratchedPixelsRef = useRef(0);
  const [revealed, setRevealed] = useState(alreadyScratched);

  useEffect(() => {
    setRevealed(alreadyScratched);
  }, [alreadyScratched]);

  useEffect(() => {
    if (revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = 280);
    const h = (canvas.height = 140);

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#D7B99B');
    grad.addColorStop(1, '#B6794C');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#FDF8F3';
    ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(coverLabel, w / 2, h / 2);
    scratchedPixelsRef.current = 0;
  }, [coverLabel, revealed]);

  const scratchAt = (clientX: number, clientY: number) => {
    if (revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    scratchedPixelsRef.current += 1;
    if (scratchedPixelsRef.current > 20) {
      soundFX.playBloom();
      setRevealed(true);
      onComplete(id);
    }
  };

  return (
    <div className="relative flex min-h-[140px] flex-col justify-center overflow-hidden rounded-2xl border border-[#6E4534]/15 bg-[#FDF8F3] p-5 shadow-xs">
      <p className="text-xs font-semibold text-[#B6794C]">{hiddenTitle}</p>
      <p className="mt-1.5 text-sm leading-relaxed font-medium text-[#3B2318]">
        {hiddenMessage}
      </p>

      {!revealed && (
        <>
          <canvas
            ref={canvasRef}
            onPointerDown={(e) => {
              isDrawingRef.current = true;
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              scratchAt(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (!isDrawingRef.current) return;
              scratchAt(e.clientX, e.clientY);
            }}
            onPointerUp={() => {
              isDrawingRef.current = false;
            }}
            onPointerCancel={() => {
              isDrawingRef.current = false;
            }}
            style={{ touchAction: 'none' }}
            className="absolute inset-0 h-full w-full cursor-crosshair rounded-2xl"
          />
          <button
            type="button"
            onClick={() => {
              soundFX.playBloom();
              setRevealed(true);
              onComplete(id);
            }}
            className="absolute right-2.5 bottom-2 z-10 rounded-lg bg-[#FDF8F3]/90 px-2.5 py-1 text-[11px] font-semibold text-[#4A2C20] shadow-xs"
          >
            Tap reveal
          </button>
        </>
      )}
    </div>
  );
}

interface Page5SmileChallengeProps {
  miniGameWon: boolean;
  miniGameBestScore: number;
  scratchedCards: number[];
  hugsSent: number;
  onUpdateGame: (score: number, won: boolean) => void;
  onScratchComplete: (cardId: number) => void;
  onSendHug: () => void;
  onTriggerGrandCelebration: () => void;
  onBack: () => void;
  onReplay: () => void;
}

export function Page5SmileChallenge({
  miniGameWon,
  miniGameBestScore,
  scratchedCards,
  hugsSent,
  onUpdateGame,
  onScratchComplete,
  onSendHug,
  onTriggerGrandCelebration,
  onBack,
  onReplay,
}: Page5SmileChallengeProps) {
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'FINISHED'>('IDLE');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PAGE_5_SMILE_CHALLENGE.miniGame.durationSeconds);
  const [targets, setTargets] = useState<FloatingHeartTarget[]>([]);
  const scoreRef = useRef(0);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const heartEmojis = ['🤎', '💗', '🧡', '🩷'];

    const spawnInterval = setInterval(() => {
      setTargets((prev) => [
        ...prev.slice(-8),
        {
          id: Date.now() + Math.random(),
          xPct: 14 + Math.random() * 72,
          yPct: 88,
          speed: 1 + Math.random() * 0.85,
          emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
        },
      ]);
    }, 480);

    const moveInterval = setInterval(() => {
      setTargets((prev) =>
        prev
          .map((t) => ({ ...t, yPct: t.yPct - t.speed * 2.2 }))
          .filter((t) => t.yPct > -8),
      );
    }, 45);

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
      clearInterval(timerInterval);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'PLAYING' && timeLeft === 0) {
      setGameState('FINISHED');
      onUpdateGame(scoreRef.current, scoreRef.current >= PAGE_5_SMILE_CHALLENGE.miniGame.goal);
    }
  }, [gameState, timeLeft, onUpdateGame]);

  const startMiniGame = () => {
    soundFX.playSoftClick();
    scoreRef.current = 0;
    setScore(0);
    setTargets([]);
    setTimeLeft(PAGE_5_SMILE_CHALLENGE.miniGame.durationSeconds);
    setGameState('PLAYING');
  };

  const catchHeart = (id: number) => {
    soundFX.playPop();
    setTargets((prev) => prev.filter((t) => t.id !== id));
    const nextScore = scoreRef.current + 1;
    scoreRef.current = nextScore;
    setScore(nextScore);

    if (nextScore >= PAGE_5_SMILE_CHALLENGE.miniGame.goal) {
      soundFX.playCelebrate();
      onTriggerGrandCelebration();
      onUpdateGame(nextScore, true);
      setGameState('FINISHED');
    }
  };

  const handleHug = () => {
    soundFX.playCelebrate();
    onSendHug();
    onTriggerGrandCelebration();
  };

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-[#6E4534]/12 bg-[#FAF2E8]/92 p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-[36px] items-center gap-1 text-xs font-medium text-[#6E4534] transition-colors hover:text-[#4A2C20]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>
          <span className="text-xs font-medium text-[#6E4534]/75">Final Chapter</span>
        </div>

        <h1
          className="font-display mt-2 text-3xl leading-tight font-semibold text-[#4A2C20] sm:text-4xl"
          style={{ textWrap: 'balance' }}
        >
          {PAGE_5_SMILE_CHALLENGE.heading}
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-[#6E4534] sm:text-base">
          {PAGE_5_SMILE_CHALLENGE.subtitle}
        </p>
      </div>

      {/* Heart Mini-Game + 3 Scratch Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-3xl border border-[#6E4534]/12 bg-[#FAF2E8]/92 p-6 shadow-sm lg:col-span-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#4A2C20]">
                {PAGE_5_SMILE_CHALLENGE.miniGame.title}
              </h2>
              <p className="mt-0.5 text-xs text-[#6E4534]">
                {PAGE_5_SMILE_CHALLENGE.miniGame.description}
              </p>
            </div>
            <div className="text-xs font-semibold text-[#4A2C20] tabular-nums">
              {score}/{PAGE_5_SMILE_CHALLENGE.miniGame.goal} · {timeLeft}s
            </div>
          </div>

          <div className="relative mt-4 h-60 w-full overflow-hidden rounded-2xl border border-[#6E4534]/15 bg-gradient-to-b from-[#FDF8F3] to-[#F5EAD9] select-none">
            {gameState === 'IDLE' && (
              <div className="flex h-full flex-col items-center justify-center p-5 text-center">
                <p className="text-sm font-medium text-[#4A2C20]">
                  {miniGameBestScore > 0
                    ? `Best catch: ${miniGameBestScore} hearts!`
                    : 'Tap Start to catch 8 floating hearts'}
                </p>
                <button
                  type="button"
                  onClick={startMiniGame}
                  className="mt-4 inline-flex min-h-[46px] items-center gap-2 rounded-2xl bg-[#6E4534] px-6 py-2.5 text-sm font-semibold text-[#FDF8F3] shadow-sm transition-transform hover:bg-[#4A2C20] active:scale-[0.97]"
                >
                  <Play className="h-4 w-4" />
                  <span>{PAGE_5_SMILE_CHALLENGE.miniGame.startLabel}</span>
                </button>
              </div>
            )}

            {gameState === 'PLAYING' &&
              targets.map((target) => (
                <button
                  key={target.id}
                  type="button"
                  aria-label="Catch heart"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    catchHeart(target.id);
                  }}
                  onClick={() => catchHeart(target.id)}
                  style={{
                    left: `${target.xPct}%`,
                    top: `${target.yPct}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#FDF8F3]/90 text-2xl shadow-sm active:scale-125"
                >
                  {target.emoji}
                </button>
              ))}

            {gameState === 'FINISHED' && (
              <div className="flex h-full flex-col items-center justify-center p-5 text-center">
                <p className="font-display text-lg font-semibold text-[#4A2C20]">
                  {score >= PAGE_5_SMILE_CHALLENGE.miniGame.goal || miniGameWon
                    ? PAGE_5_SMILE_CHALLENGE.miniGame.winMessage
                    : PAGE_5_SMILE_CHALLENGE.miniGame.almostMessage}
                </p>
                <button
                  type="button"
                  onClick={startMiniGame}
                  className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-2xl border border-[#6E4534]/20 bg-[#FDF8F3] px-5 py-2 text-sm font-semibold text-[#4A2C20] hover:bg-[#EFE2D0]"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>{PAGE_5_SMILE_CHALLENGE.miniGame.playAgainLabel}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3 Scratch Cards */}
        <div className="rounded-3xl border border-[#6E4534]/12 bg-[#FAF2E8]/92 p-6 shadow-sm lg:col-span-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#4A2C20]">
                Scratch Little Surprises
              </h2>
              <p className="mt-0.5 text-xs text-[#6E4534]">
                Rub across each card (or tap reveal).
              </p>
            </div>
            <span className="text-xs font-medium text-[#6E4534]/80 tabular-nums">
              {scratchedCards.length}/{PAGE_5_SMILE_CHALLENGE.scratchCards.length}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {PAGE_5_SMILE_CHALLENGE.scratchCards.map((card) => (
              <ScratchCard
                key={card.id}
                id={card.id}
                coverLabel={card.coverLabel}
                hiddenTitle={card.hiddenTitle}
                hiddenMessage={card.hiddenMessage}
                alreadyScratched={scratchedCards.includes(card.id)}
                onComplete={onScratchComplete}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Final Warm Hug & Celebration */}
      <div className="grid grid-cols-1 items-center gap-6 rounded-3xl border border-[#8BA389]/40 bg-[#FDF8F3] p-6 shadow-sm sm:p-8 lg:grid-cols-12">
        <div className="mx-auto w-full max-w-[230px] lg:col-span-4">
          <IllustrationCard
            src="/khushi_celebration_hug_1794764569627.jpg"
            alt="Two cheerful little bears hugging under floating stars and petals"
            onTap={handleHug}
            interactiveHint="Tap for celebration confetti"
          />
        </div>

        <div className="lg:col-span-8">
          <h2 className="font-display text-2xl font-bold text-[#4A2C20] sm:text-3xl">
            {PAGE_5_SMILE_CHALLENGE.finalCelebration.headline}
          </h2>
          <p className="mt-2.5 text-base leading-relaxed text-[#6E4534]">
            {PAGE_5_SMILE_CHALLENGE.finalCelebration.body}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleHug}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-[#C98A8B] px-6 py-3 text-sm font-semibold text-[#FDF8F3] shadow-sm transition-all hover:bg-[#B47273] active:scale-[0.97]"
            >
              <Heart className="h-4 w-4 fill-current" />
              <span>{PAGE_5_SMILE_CHALLENGE.finalCelebration.hugButtonLabel}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFX.playSoftClick();
                onReplay();
              }}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border border-[#6E4534]/20 bg-[#FAF2E8] px-5 py-3 text-sm font-semibold text-[#4A2C20] transition-colors hover:bg-[#EFE2D0]"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{PAGE_5_SMILE_CHALLENGE.finalCelebration.replayButton}</span>
            </button>

            {hugsSent > 0 && (
              <span className="text-xs font-semibold text-[#6E4534] tabular-nums">
                Hugs sent: {hugsSent} 🤎
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
