import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { PAGES_META, SITE_META } from '../data/messages';
import { PageId } from '../types/app';

interface TopBarProps {
  currentPage: PageId;
  highestVisited: PageId;
  onNavigate: (page: PageId) => void;
  onReplay: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function TopBar({
  currentPage,
  highestVisited,
  onNavigate,
  onReplay,
  soundEnabled,
  onToggleSound,
}: TopBarProps) {
  const progressPct = ((currentPage + 1) / PAGES_META.length) * 100;

  return (
    <header className="sticky top-0 z-30 border-b border-[#6E4534]/10 bg-[#FDF8F3]/88 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:gap-8 sm:px-6">
        {/* Zone 1: Single-element wordmark */}
        <button
          type="button"
          onClick={() => onNavigate(0)}
          className="font-display shrink-0 whitespace-nowrap text-lg font-semibold tracking-tight text-[#4A2C20] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[#6E4534]"
        >
          {SITE_META.brandTitle}
        </button>

        {/* Zone 2: Clean single-line chapter navigation links */}
        <nav aria-label="Chapters" className="hidden items-center gap-5 md:flex">
          {PAGES_META.map((p) => {
            const isActive = p.id === currentPage;
            const isReachable = p.id <= highestVisited;
            return (
              <button
                key={p.id}
                type="button"
                disabled={!isReachable}
                onClick={() => onNavigate(p.id)}
                className={`relative shrink-0 whitespace-nowrap py-1 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#6E4534] ${
                  isActive
                    ? 'text-[#4A2C20]'
                    : isReachable
                      ? 'text-[#6E4534]/75 hover:text-[#4A2C20]'
                      : 'cursor-not-allowed text-[#6E4534]/35'
                }`}
              >
                {p.shortLabel}
                {isActive && (
                  <span className="absolute right-0 -bottom-0.5 left-0 h-0.5 rounded-full bg-[#B6794C]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile chapter progress text (unboxed clean metadata) */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#6E4534]/80 md:hidden">
          <span className="whitespace-nowrap tabular-nums">
            {currentPage + 1} / {PAGES_META.length}
          </span>
          <span aria-hidden="true">·</span>
          <span className="max-w-[110px] truncate">{PAGES_META[currentPage].shortLabel}</span>
        </div>

        {/* Zone 3: Replay primary action + compact mute icon */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? SITE_META.soundOnLabel : SITE_META.soundOffLabel}
            title={soundEnabled ? SITE_META.soundOnLabel : SITE_META.soundOffLabel}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#6E4534] transition-colors hover:bg-[#EFE2D0]/70 focus-visible:outline-2 focus-visible:outline-[#6E4534]"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 opacity-60" />}
          </button>
          <button
            type="button"
            onClick={onReplay}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-[#6E4534]/20 bg-[#FAF2E8] px-3.5 text-xs font-semibold text-[#4A2C20] transition-all duration-200 hover:bg-[#EFE2D0] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#6E4534]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{SITE_META.replayLabel}</span>
          </button>
        </div>
      </div>

      {/* Subtle progress line */}
      <div className="h-0.5 w-full bg-[#EFE2D0]/70">
        <div
          className="h-full bg-gradient-to-r from-[#C98A8B] via-[#B6794C] to-[#8BA389] transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </header>
  );
}
