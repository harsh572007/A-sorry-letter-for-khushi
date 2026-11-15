import { PageMeta } from '../types/app';

/**
 * ============================================================================
 * PERSONALIZED MESSAGES & COPY FOR KHUSHI
 * ============================================================================
 * Edit any heading, paragraph, button label, or playful dodge line below!
 * All UI components read directly from this file so you can customize every
 * personal message without changing any layout or interaction logic.
 * ============================================================================
 */

export const SITE_META = {
  brandTitle: 'For merii pyaariii si bhnaa Khushi',
  replayLabel: 'Replay',
  soundOnLabel: 'Chimes on',
  soundOffLabel: 'Muted',
  footerNote: 'Made with lots of warmth for Khushi',
};

export const PAGES_META: PageMeta[] = [
  { id: 0, shortLabel: 'Hello' },
  { id: 1, shortLabel: 'Check-In' },
  { id: 2, shortLabel: 'My Sorry' },
  { id: 3, shortLabel: 'Us Again' },
  { id: 4, shortLabel: 'Smile' },
];

export const PAGE_1_WELCOME = {
  heading: 'Heyieeee Khushiiii! 🥺🤎',
  subtitle: 'Okay, so... I have a little something for you.',
  envelopeNotePreview: 'A tiny envelope full of honesty, warmth & one big sorry...',
  openButtonLabel: 'Open your little surprise 💌',
  bearTapReactions: [
    'Hehe, this bear is rooting for us! 🧸',
    'Sending one cozy bear hug first!',
    'Tap the button below to open your letter 💌',
  ],
};

export const PAGE_2_UPSET_CHECK = {
  leadIn: 'First of all, tell me something...',
  question: 'Are you still upset with me?',
  yesDodgeButton: 'Yes, I am! 🙄',
  noAllowButton: 'No, not anymore! Tujhse gussa kaise reh sakti hu? 🤎',
  dodgeMessages: [
    'Hehe, missed! Try again 😜',
    'Whoa, too slow! That button is shy today 🏃‍♀️',
    'Nope! It refuses to stay still 🥺',
    'Okay okay, just tap the brown button already 🤎',
  ],
  acceptedHeadline: 'WAITTT, REALLY?! LOVE YOU SO MUCHHH😭🤎',
  acceptedBody: 'That just made my whole day! Still, there is something I really want to tell you...',
  nextButton: 'Read my little letter 💌',
};

export const PAGE_3_SORRY_LETTER = {
  heading: "Okay, Here's My Sorry! 💌",
  salutation: 'KHUSHIIIIIII BHNAAAAAA!',
  paragraphs: [
    'please please please ywlll maaf krdo maiii bs msti krrha tha aage se ni krunga, pkka to nhi Keh sakta lekinn limit me krdungaa aur try krunga ki naraz na ho aap. Please maaf krdoo naww ywll. Btw itna to chlta hai na ki mjaak msti kru? hnn hnn ik ki maine jyada hi boldiya tha lekin kya kru aapse hi Baat krta hu jyadatar to msti mjaak krleta hu. Yk Yk ki na jo logo Saath jitna mjaak msti krta hai na wo usse utna hi pyaar krta hai, mai to bhtttt hiii jyada krta hu lekin aage se thoda km krunga khi aap dubara gussa na ho jao isliye. Ab aapki jo marzi mai to thoda sa km krdungaa. (Just Kidding Hahaha aapko Pyaar krna koi kaise km krskta hai mai to bilkul bhi nhi Love you so muvhhh) lekin hnn preshan km krne ka try krunga pkka se. ',
    "Jokes apart I'm genuinely sorry maaf krdo, aapke is najaayz bhai se ek galti hogyi 😭🙇",
  ],
  closingLine: 'aaapka PYAARA Bhai',
  signature: 'HARSH',
  waxSealPrompt: 'Tap for a tiny P.S.',
  secretPostScript:
    'Even when we act quiet or stubborn, I got new people, in my life you will always be my favorite person in the whole world.',
  nextButton: 'One quick thing... 🫶',
};

export const PAGE_4_NORMAL_AGAIN = {
  heading: 'Can We Be Normal Again? 🫶',
  question: 'Abhi bhi gussa ho cya? 😶🌫️ Maaf krdiyaaa kyaa? Krdoo naa ywlll plijjjjjj 🥺',
  yesAllowButton: 'Okayyy, yes! 🤎',
  noDodgeButton: 'Let me think! 🙄',
  dodgeMessages: [
    'Hey! No thinking too long 😜',
    'Awkwardness is not allowed anymore! 🏃‍♂️',
    'Catch me if you can... or just say yes 🥹',
  ],
  acceptedHeadline: 'YAYYYYY! Back to normal! 😭🤎',
  acceptedBody: 'Thank youuu! Awkwardness is officially cancelled. Ready for a tiny smile challenge?',
  nextButton: 'Go to Smile Challenge 🌷',
};

export const PAGE_5_SMILE_CHALLENGE = {
  heading: 'A Little Smile Challenge 🌷',
  subtitle: 'Just a couple of cute little things to make you smile — and then one big hug!',
  miniGame: {
    title: 'Catch 8 Cozy Hearts',
    description: 'Tap the floating hearts before they drift away.',
    startLabel: 'Start Game',
    playAgainLabel: 'Play Again',
    goal: 8,
    durationSeconds: 18,
    winMessage: '8/8! You unlocked unlimited snacks & zero excuses from me! 🤎',
    almostMessage: 'So close! Tap Play Again or scratch the surprise cards below.',
  },
  scratchCards: [
    {
      id: 0,
      coverLabel: 'Scratch me ✨',
      hiddenTitle: 'Promise #1',
      hiddenMessage: 'I promise to listen properly instead of rushing or being stubborn.',
    },
    {
      id: 1,
      coverLabel: 'Scratch me 🤎',
      hiddenTitle: 'Truth Note',
      hiddenMessage: 'Everything feels way nicer when we are talking normally.',
    },
    {
      id: 2,
      coverLabel: 'Scratch me 🌸',
      hiddenTitle: 'Treat Coupon',
      hiddenMessage: 'Redeemable for your favorite snack or iced coffee anytime!',
    },
  ],
  finalCelebration: {
    headline: 'YAYYYYY! KHUSHI FORGAVE MEEEE! 😭🤎',
    body: "Thank youuu for smiling! I promise I'll try to be more thoughtful. Sending you lots of love!",
    hugButtonLabel: 'Send a big hug 🫂',
    replayButton: 'Replay from start',
  },
};
