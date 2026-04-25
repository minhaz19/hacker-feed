
export interface HNItem {
  id: number;
  title: string;
  url?: string;
  by: string;
  score: number;
  time: number; // Unix timestamp
  type: string;
  text?: string;
  descendants?: number;
  kids?: number[];
}

export interface Story {
  id: number;
  title: string;
  url: string;
  domain: string;
  by: string;
  score: number;
  time: number; // Unix timestamp
}

export type SortMode = 'score' | 'time';

export type LoadingState = 'idle' | 'loading' | 'refreshing' | 'error';
