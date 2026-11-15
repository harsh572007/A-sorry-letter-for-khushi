import { useState } from 'react';
import { Heart } from 'lucide-react';

interface IllustrationCardProps {
  src: string;
  alt: string;
  aspectClass?: string;
  caption?: string;
  onTap?: () => void;
  interactiveHint?: string;
}

export function IllustrationCard({
  src,
  alt,
  aspectClass = 'aspect-square',
  caption,
  onTap,
  interactiveHint,
}: IllustrationCardProps) {
  const [hasError, setHasError] = useState(false);
  const [wiggle, setWiggle] = useState(false);

  const handleClick = () => {
    if (!onTap) return;
    setWiggle(true);
    onTap();
    setTimeout(() => setWiggle(false), 380);
  };

  const Wrapper = onTap ? 'button' : 'div';

  return (
    <div className="flex flex-col items-center">
      <Wrapper
        {...(onTap ? { type: 'button' as const, onClick: handleClick } : {})}
        className={`group relative w-full overflow-hidden rounded-3xl border border-[#6E4534]/12 bg-[#FAF2E8] shadow-[0_14px_34px_-16px_rgba(74,44,32,0.22)] transition-transform duration-300 ${
          onTap ? 'cursor-pointer hover:scale-[1.015] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#6E4534]' : ''
        } ${wiggle ? 'scale-[1.03] -rotate-1' : ''}`}
      >
        <div className={`relative w-full ${aspectClass} overflow-hidden bg-[#FDF8F3]`}>
          {!hasError ? (
            <img
              src={src}
              alt={alt}
              referrerPolicy="no-referrer"
              onError={() => setHasError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#FAF2E8] via-[#EFE2D0] to-[#F5E6E4] p-6 text-center">
              <Heart className="h-10 w-10 text-[#C98A8B]" />
              <p className="font-display text-base font-medium text-[#4A2C20]">{alt}</p>
            </div>
          )}
        </div>
        {interactiveHint && (
          <span className="block border-t border-[#6E4534]/10 bg-[#FDF8F3]/85 px-4 py-2 text-center text-xs font-medium text-[#6E4534]/85">
            {interactiveHint}
          </span>
        )}
      </Wrapper>
      {caption && (
        <p className="mt-3 text-center text-xs font-medium text-[#6E4534]/80">{caption}</p>
      )}
    </div>
  );
}
