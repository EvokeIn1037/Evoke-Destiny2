import type { PlayerProfile } from '@/domain/types/player';

export type PlayerStatus = 'idle' | 'loading' | 'success' | 'error';

export interface PlayerState {
  status: PlayerStatus;
  profile: PlayerProfile | null;
  error: string | null;
}

export interface PlayerContextValue extends PlayerState {
  search: (name: string) => void;
  reset: () => void;
}
