import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PAGE_4_NORMAL_AGAIN } from '../../data/messages';
import { soundFX } from '../../utils/sound';
import { DodgingChoiceArena } from '../DodgingChoiceArena';
import { IllustrationCard } from '../IllustrationCard';

interface Page4NormalAgainProps {
  normalConfirmed: boolean;
  onConfirmNormal: () => void;
  onDodge: (count: number) => void;
  onBack: () => void;
  onContinue: () => void;
  onGentleBurst: () => void;
}

export function Page4NormalAgain({
  normalConfirmed,
  onConfirmNormal,
  onDodge,
  onBack,
  onContinue,
  onGentleBurst,
}: Page4NormalAgainProps) {
  const handleAllow = () => {
    soundFX.playCelebrate();
    onGentleBurst();
    onConfirmNormal();
  };

  return (
    <section className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Cozy Cocoa Illustration */}
      <div className="order-1 lg:col-span-5">
        <div className="mx-auto max-w-sm lg:max-w-none">
          <IllustrationCard
            src="/src/assets/images/khushi_tea_moment_1794764569284.jpg"
            alt="Two steaming mugs of hot cocoa with heart marshmallows and a cozy journal"
            aspectClass="aspect-[4/3]"
            caption="Missing our random chai & cocoa talks."
          />
        </div>
      </div>

      {/* Single Crisp Question Card */}
      <div className="order-2 lg:col-span-7">
        <div className="rounded-3xl border border-[#6E4534]/12 bg-[#FAF2E8]/92 p-6 shadow-[0_14px_34px_-16px_rgba(74,44,32,0.16)] sm:p-9">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-medium text-[#6E4534]/80">
              {PAGE_4_NORMAL_AGAIN.heading}
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
            className="font-display mt-2 text-2xl leading-[1.2] font-semibold text-[#4A2C20] sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            {PAGE_4_NORMAL_AGAIN.question}
          </h1>

          <DodgingChoiceArena
            allowLabel={PAGE_4_NORMAL_AGAIN.yesAllowButton}
            dodgeLabel={PAGE_4_NORMAL_AGAIN.noDodgeButton}
            dodgeMessages={PAGE_4_NORMAL_AGAIN.dodgeMessages}
            allowSelected={normalConfirmed}
            onAllow={handleAllow}
            onDodge={onDodge}
          />

          <AnimatePresence>
            {normalConfirmed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-5 rounded-2xl border border-[#8BA389]/45 bg-[#FDF8F3] p-5"
              >
                <h2 className="font-display text-xl font-semibold text-[#4A2C20] sm:text-2xl">
                  {PAGE_4_NORMAL_AGAIN.acceptedHeadline}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[#6E4534]">
                  {PAGE_4_NORMAL_AGAIN.acceptedBody}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playSoftClick();
                    onContinue();
                  }}
                  className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[#6E4534] px-6 py-3 text-sm font-semibold text-[#FDF8F3] shadow-sm transition-all hover:bg-[#4A2C20] active:scale-[0.98] sm:w-auto"
                >
                  <span>{PAGE_4_NORMAL_AGAIN.nextButton}</span>
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
