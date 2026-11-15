import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { PAGE_3_SORRY_LETTER } from '../../data/messages';
import { soundFX } from '../../utils/sound';

interface Page3SorryLetterProps {
  onBack: () => void;
  onContinue: () => void;
  onGentleBurst: () => void;
}

export function Page3SorryLetter({
  onBack,
  onContinue,
  onGentleBurst,
}: Page3SorryLetterProps) {
  const [sealOpened, setSealOpened] = useState(false);

  const handleOpenSeal = () => {
    soundFX.playSparkle();
    if (!sealOpened) {
      onGentleBurst();
    }
    setSealOpened((prev) => !prev);
  };

  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="rounded-3xl border border-[#6E4534]/15 bg-[#FDF8F3] p-6 shadow-[0_16px_40px_-18px_rgba(74,44,32,0.18)] sm:p-10">
        <div className="flex items-center justify-between gap-3 border-b border-[#6E4534]/10 pb-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-[36px] items-center gap-1 text-xs font-medium text-[#6E4534] transition-colors hover:text-[#4A2C20]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>
          <span className="text-xs font-medium text-[#6E4534]/75">A letter for you</span>
        </div>

        <h1
          className="font-display mt-5 text-3xl leading-tight font-semibold text-[#4A2C20] sm:text-4xl"
          style={{ textWrap: 'balance' }}
        >
          {PAGE_3_SORRY_LETTER.heading}
        </h1>

        <div className="relative mt-5 rounded-2xl border border-[#B6794C]/20 bg-gradient-to-b from-[#FAF2E8]/85 to-[#FDF8F3] p-6 sm:p-8">
          <p className="font-display text-lg font-medium italic text-[#6E4534] sm:text-xl">
            {PAGE_3_SORRY_LETTER.salutation}
          </p>

          <div className="mt-4 space-y-3.5">
            {PAGE_3_SORRY_LETTER.paragraphs.map((line, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: index * 0.14 }}
                className="font-display text-lg leading-relaxed text-[#3B2318] sm:text-xl"
              >
                {line}
              </motion.p>
            ))}
          </div>

          <div className="mt-6 border-t border-[#6E4534]/12 pt-4">
            <p className="font-display text-base italic text-[#6E4534]">
              {PAGE_3_SORRY_LETTER.closingLine}
            </p>
            <p className="font-display mt-1 text-xl font-semibold text-[#4A2C20]">
              {PAGE_3_SORRY_LETTER.signature}
            </p>
          </div>

          <div className="mt-5 flex flex-col items-start gap-3">
            <button
              type="button"
              onClick={handleOpenSeal}
              className="inline-flex min-h-[44px] items-center gap-2.5 rounded-2xl border border-[#C98A8B]/40 bg-[#FDF8F3] px-4 py-2 text-xs font-semibold text-[#4A2C20] shadow-xs transition-transform hover:bg-[#FAF2E8] active:scale-[0.97]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C98A8B] text-xs text-[#FDF8F3]">
                🤎
              </span>
              <span>{PAGE_3_SORRY_LETTER.waxSealPrompt}</span>
              <Sparkles className="h-3.5 w-3.5 text-[#B6794C]" />
            </button>

            <AnimatePresence>
              {sealOpened && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="w-full rounded-2xl border border-[#C98A8B]/30 bg-[#FDF8F3] p-4 text-sm leading-relaxed text-[#4A2C20]"
                >
                  <span className="font-display italic">{PAGE_3_SORRY_LETTER.secretPostScript}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              soundFX.playSoftClick();
              onContinue();
            }}
            className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-[#6E4534] px-7 py-3.5 text-sm font-semibold text-[#FDF8F3] shadow-sm transition-all hover:bg-[#4A2C20] active:scale-[0.98] sm:w-auto"
          >
            <span>{PAGE_3_SORRY_LETTER.nextButton}</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </div>
    </section>
  );
}
