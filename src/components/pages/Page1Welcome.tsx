import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MailOpen, Sparkles } from 'lucide-react';
import { PAGE_1_WELCOME } from '../../data/messages';
import { soundFX } from '../../utils/sound';
import { IllustrationCard } from '../IllustrationCard';

interface Page1WelcomeProps {
  onContinue: () => void;
  onGentleBurst: () => void;
}

export function Page1Welcome({ onContinue, onGentleBurst }: Page1WelcomeProps) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [bearTapIdx, setBearTapIdx] = useState(-1);

  const handleOpenSurprise = () => {
    if (envelopeOpen) return;
    soundFX.playBloom();
    setEnvelopeOpen(true);
    onGentleBurst();
    setTimeout(() => {
      onContinue();
    }, 360);
  };

  const handleBearTap = () => {
    soundFX.playPop();
    setBearTapIdx((prev) => (prev + 1) % PAGE_1_WELCOME.bearTapReactions.length);
  };

  return (
    <section className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Bear Illustration */}
      <div className="order-1 lg:order-2 lg:col-span-5">
        <div className="mx-auto max-w-xs sm:max-w-sm lg:max-w-none">
          <IllustrationCard
            src="/src/assets/images/khushi_bear_envelope_1794764567692.jpg"
            alt="Cozy teddy bear holding a cream envelope with a heart wax seal"
            onTap={handleBearTap}
            interactiveHint="Tap the bear for a tiny hug"
          />
          <AnimatePresence mode="wait">
            {bearTapIdx >= 0 && (
              <motion.p
                key={bearTapIdx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="mt-3 text-center text-sm font-medium text-[#6E4534]"
              >
                {PAGE_1_WELCOME.bearTapReactions[bearTapIdx]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Welcome Card + Animated Envelope */}
      <div className="order-2 lg:order-1 lg:col-span-7">
        <div className="rounded-3xl border border-[#6E4534]/12 bg-[#FAF2E8]/92 p-6 shadow-[0_14px_34px_-16px_rgba(74,44,32,0.16)] sm:p-9">
          <h1
            className="font-display text-3xl leading-[1.15] font-semibold text-[#4A2C20] sm:text-5xl"
            style={{ textWrap: 'balance' }}
          >
            {PAGE_1_WELCOME.heading}
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#6E4534] sm:text-lg">
            {PAGE_1_WELCOME.subtitle}
          </p>

          {/* Compact Animated Envelope */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleOpenSurprise}
              aria-label="Open interactive envelope"
              className="group relative block w-full max-w-md cursor-pointer rounded-2xl border border-[#6E4534]/15 bg-[#FDF8F3] p-4 text-left shadow-sm transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <div className="relative overflow-hidden rounded-xl border border-[#B6794C]/25 bg-gradient-to-b from-[#FAF2E8] to-[#EFE2D0] px-4 pt-7 pb-5">
                <motion.div
                  animate={envelopeOpen ? { rotateX: 165, y: -6, opacity: 0.4 } : { rotateX: 0, y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: 'top center' }}
                  className="pointer-events-none absolute inset-x-0 top-0 h-12 border-b border-[#B6794C]/25 bg-[#F5EAD9]"
                />
                <motion.div
                  animate={envelopeOpen ? { y: -10, scale: 1.02 } : { y: 0, scale: 1 }}
                  transition={{ duration: 0.28 }}
                  className="relative z-10 rounded-xl border border-[#6E4534]/12 bg-[#FDF8F3] p-3.5 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-sm font-semibold text-[#4A2C20]">
                      To: Khushi
                    </span>
                    <Sparkles className="h-4 w-4 text-[#B6794C]" />
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#6E4534]">
                    {PAGE_1_WELCOME.envelopeNotePreview}
                  </p>
                </motion.div>
              </div>
            </button>
          </div>

          {/* Primary Action */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleOpenSurprise}
              disabled={envelopeOpen}
              className="inline-flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-2xl bg-[#6E4534] px-7 py-3.5 text-sm font-semibold text-[#FDF8F3] shadow-sm transition-all duration-150 hover:bg-[#4A2C20] active:scale-[0.97] disabled:opacity-80 sm:w-auto"
            >
              <MailOpen className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">{PAGE_1_WELCOME.openButtonLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
