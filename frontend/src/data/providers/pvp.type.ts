import type { PvpActivity } from '@/domain/types/pvp';

export type PvpStatus = 'idle' | 'loading' | 'success' | 'error';

export interface PvpDataState {
  status: PvpStatus;
  activities: PvpActivity[];
  error: string | null;
}

export interface PvpContextValue {
  data: Record<string, PvpDataState>;
  load: (membershipId: string, characterId: string, mode: number) => void;
  getState: (characterId: string, mode: number) => PvpDataState;
}
