import type { RaidActivity } from '@/domain/types/raid';

export type RaidStatus = 'idle' | 'loading' | 'success' | 'error';

export interface RaidDataState {
  status: RaidStatus;
  activities: RaidActivity[];
  error: string | null;
}

export interface RaidContextValue {
  data: Record<string, RaidDataState>;
  load: (membershipId: string, characterId: string, mode: number) => void;
  getState: (characterId: string, mode: number) => RaidDataState;
}
