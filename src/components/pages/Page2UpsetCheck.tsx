import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PAGE_2_UPSET_CHECK } from '../../data/messages';
import { soundFX } from '../../utils/sound';
import { DodgingChoiceArena } from '../DodgingChoiceArena';
import { IllustrationCard } from '../IllustrationCard';

interface Page2UpsetCheckProps {
  notUpsetConfirmed: boolean;
  onConfirmNotUpset: () => void;
  onDodge: (count: number) => void;
  onBack: () => void;
  onContinue: () => void;
  onGentleBurst: () => void;
}

export function Page2UpsetCheck({
  notUpsetConfirmed,
  onConfirmNotUpset,
  onDodge,
  onBack,
  onContinue,
  onGentleBurst,
}: Page2UpsetCheckProps) {
  const handleAllow = () => {
    soundFX.playBloom();
    onGentleBurst();
    onConfirmNotUpset();
  };

  return (
    <section className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Bunny Illustration */}
      <div className="order-1 lg:col-span-5">
        <motion.div
          animate={notUpsetConfirmed ? { y: [0, -6, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-xs sm:max-w-sm lg:max-w-none"
        >
          <IllustrationCard
            src="/src/assets/images/khushi_sorry_bouquet_1794764568841.jpg"
            alt="Shy caramel bunny holding wildflowers behind its back"
            caption={
              notUpsetConfirmed
                ? 'Bunny is literally doing a happy dance right now!'
                : 'Brought a little bouquet just for you.'
            }
          />
        </motion.div>
      </div>

      {/* Upset Check Card with Dodging YES Button */}
      <div className="order-2 lg:col-span-7">
        <div className="rounded-3xl border border-[#6E4534]/12 bg-[#FAF2E8]/92 p-6 shadow-[0_14px_34px_-16px_rgba(74,44,32,0.16)] sm:p-9">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-medium text-[#6E4534]/80">
              {PAGE_2_UPSET_CHECK.leadIn}
            </p>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex min-h-[36px] items-center gap-1 text-xs font-medium text-[#6E4534] transition-colors hover:text-[#4A2C20]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
          </div>

          <h1
            className="font-display mt-2 text-3xl leading-[1.15] font-semibold text-[#4A2C20] sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            {PAGE_2_UPSET_CHECK.question}
          </h1>

          <DodgingChoiceArena
            allowLabel={PAGE_2_UPSET_CHECK.noAllowButton}
            dodgeLabel={PAGE_2_UPSET_CHECK.yesDodgeButton}
            dodgeMessages={PAGE_2_UPSET_CHECK.dodgeMessages}
            allowSelected={notUpsetConfirmed}
            onAllow={handleAllow}
            onDodge={onDodge}
          />

          <AnimatePresence>
            {notUpsetConfirmed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-5 rounded-2xl border border-[#8BA389]/45 bg-[#FDF8F3] p-5"
              >
                <h2 className="font-display text-xl font-semibold text-[#4A2C20] sm:text-2xl">
                  {PAGE_2_UPSET_CHECK.acceptedHeadline}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[#6E4534]">
                  {PAGE_2_UPSET_CHECK.acceptedBody}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playSoftClick();
                    onContinue();
                  }}
                  className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[#6E4534] px-6 py-3 text-sm font-semibold text-[#FDF8F3] shadow-sm transition-all hover:bg-[#4A2C20] active:scale-[0.98] sm:w-auto"
                >
                  <span>{PAGE_2_UPSET_CHECK.nextButton}</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
