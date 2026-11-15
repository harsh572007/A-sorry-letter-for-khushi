export type PageId = 0 | 1 | 2 | 3 | 4;

export interface SessionAnswers {
  notUpsetConfirmed: boolean;
  upsetDodgeCount: number;
  normalConfirmed: boolean;
  normalDodgeCount: number;
  miniGameWon: boolean;
  miniGameBestScore: number;
  scratchedCards: number[];
  hugsSent: number;
}

export interface PageMeta {
  id: PageId;
  shortLabel: string;
}
