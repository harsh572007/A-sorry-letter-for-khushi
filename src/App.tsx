import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CelebrationCanvas } from './components/CelebrationCanvas';
import { DreamyBackdrop } from './components/DreamyBackdrop';
import { TopBar } from './components/TopBar';
import { Page1Welcome } from './components/pages/Page1Welcome';
import { Page2UpsetCheck } from './components/pages/Page2UpsetCheck';
import { Page3SorryLetter } from './components/pages/Page3SorryLetter';
import { Page4NormalAgain } from './components/pages/Page4NormalAgain';
import { Page5SmileChallenge } from './components/pages/Page5SmileChallenge';
import { SITE_META } from './data/messages';
import { PageId, SessionAnswers } from './types/app';
import { soundFX } from './utils/sound';

const SESSION_STORAGE_KEY = 'khushi_apology_v2';

const INITIAL_ANSWERS: SessionAnswers = {
  notUpsetConfirmed: false,
  upsetDodgeCount: 0,
  normalConfirmed: false,
  normalDodgeCount: 0,
  miniGameWon: false,
  miniGameBestScore: 0,
  scratchedCards: [],
  hugsSent: 0,
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.currentPage === 'number' && parsed.currentPage >= 0 && parsed.currentPage <= 4) {
          return parsed.currentPage as PageId;
        }
      }
    } catch {
      // ignore storage errors
    }
    return 0;
  });

  const [highestVisited, setHighestVisited] = useState<PageId>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.highestVisited === 'number' && parsed.highestVisited >= 0 && parsed.highestVisited <= 4) {
          return parsed.highestVisited as PageId;
        }
      }
    } catch {
      // ignore
    }
    return 0;
  });

  const [answers, setAnswers] = useState<SessionAnswers>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers) {
          return { ...INITIAL_ANSWERS, ...parsed.answers };
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_ANSWERS;
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [burstKey, setBurstKey] = useState(0);
  const [burstIntensity, setBurstIntensity] = useState<'gentle' | 'grand'>('gentle');

  useEffect(() => {
    try {
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ currentPage, highestVisited, answers }),
      );
    } catch {
      // ignore
    }
  }, [currentPage, highestVisited, answers]);

  const goToPage = useCallback((target: PageId) => {
    setCurrentPage(target);
    setHighestVisited((prev) => (target > prev ? target : prev));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const triggerBurst = useCallback((intensity: 'gentle' | 'grand') => {
    setBurstIntensity(intensity);
    setBurstKey((k) => k + 1);
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    soundFX.enabled = next;
    setSoundEnabled(next);
    if (next) soundFX.playSoftClick();
  };

  const handleReplay = () => {
    soundFX.playSoftClick();
    setAnswers(INITIAL_ANSWERS);
    setHighestVisited(0);
    setCurrentPage(0);
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateMiniGame = useCallback((score: number, won: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      miniGameWon: prev.miniGameWon || won,
      miniGameBestScore: Math.max(prev.miniGameBestScore, score),
    }));
  }, []);

  const handleScratchComplete = useCallback((cardId: number) => {
    setAnswers((prev) => ({
      ...prev,
      scratchedCards: prev.scratchedCards.includes(cardId)
        ? prev.scratchedCards
        : [...prev.scratchedCards, cardId],
    }));
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#FDF8F3] text-[#3B2318]">
      <DreamyBackdrop />
      <CelebrationCanvas burstKey={burstKey} intensity={burstIntensity} />

      <TopBar
        currentPage={currentPage}
        highestVisited={highestVisited}
        onNavigate={goToPage}
        onReplay={handleReplay}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      <main className="relative z-20 flex flex-1 items-center px-4 py-7 sm:px-6 sm:py-10">
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              {currentPage === 0 && (
                <Page1Welcome
                  onContinue={() => goToPage(1)}
                  onGentleBurst={() => triggerBurst('gentle')}
                />
              )}

              {currentPage === 1 && (
                <Page2UpsetCheck
                  notUpsetConfirmed={answers.notUpsetConfirmed}
                  onConfirmNotUpset={() =>
                    setAnswers((prev) => ({ ...prev, notUpsetConfirmed: true }))
                  }
                  onDodge={(count) =>
                    setAnswers((prev) => ({ ...prev, upsetDodgeCount: count }))
                  }
                  onBack={() => goToPage(0)}
                  onContinue={() => goToPage(2)}
                  onGentleBurst={() => triggerBurst('gentle')}
                />
              )}

              {currentPage === 2 && (
                <Page3SorryLetter
                  onBack={() => goToPage(1)}
                  onContinue={() => goToPage(3)}
                  onGentleBurst={() => triggerBurst('gentle')}
                />
              )}

              {currentPage === 3 && (
                <Page4NormalAgain
                  normalConfirmed={answers.normalConfirmed}
                  onConfirmNormal={() =>
                    setAnswers((prev) => ({ ...prev, normalConfirmed: true }))
                  }
                  onDodge={(count) =>
                    setAnswers((prev) => ({ ...prev, normalDodgeCount: count }))
                  }
                  onBack={() => goToPage(2)}
                  onContinue={() => goToPage(4)}
                  onGentleBurst={() => triggerBurst('gentle')}
                />
              )}

              {currentPage === 4 && (
                <Page5SmileChallenge
                  miniGameWon={answers.miniGameWon}
                  miniGameBestScore={answers.miniGameBestScore}
                  scratchedCards={answers.scratchedCards}
                  hugsSent={answers.hugsSent}
                  onUpdateGame={handleUpdateMiniGame}
                  onScratchComplete={handleScratchComplete}
                  onSendHug={() =>
                    setAnswers((prev) => ({
                      ...prev,
                      hugsSent: prev.hugsSent + 1,
                    }))
                  }
                  onTriggerGrandCelebration={() => triggerBurst('grand')}
                  onBack={() => goToPage(3)}
                  onReplay={handleReplay}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-20 border-t border-[#6E4534]/10 px-4 py-4 text-center text-xs text-[#6E4534]/75 sm:px-6">
        {SITE_META.footerNote}
      </footer>
    </div>
  );
}
