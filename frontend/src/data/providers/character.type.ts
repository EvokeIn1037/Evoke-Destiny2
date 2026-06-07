import type { CharacterDetail } from '@/domain/types/player';

export type CharacterStatus = 'idle' | 'loading' | 'success' | 'error';

export interface CharacterDetailState {
  status: CharacterStatus;
  detail: CharacterDetail | null;
  error: string | null;
}

export interface CharacterContextValue {
  characters: Record<string, CharacterDetailState>;
  load: (membershipId: string, characterId: string, lang: string) => void;
  getState: (characterId: string, lang: string) => CharacterDetailState;
}
