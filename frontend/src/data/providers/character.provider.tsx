import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { CharacterContextValue, CharacterDetailState } from './character.type';
import type { CharacterDetail } from '@/domain/types/player';
import { loadCharacterDetail } from '@/data/services/characterService';

const CharacterContext = createContext<CharacterContextValue | null>(null);

const IDLE: CharacterDetailState = { status: 'idle', detail: null, error: null };

type Action =
  | { type: 'LOAD_START'; characterId: string }
  | { type: 'LOAD_SUCCESS'; characterId: string; detail: CharacterDetail }
  | { type: 'LOAD_ERROR'; characterId: string; error: string };

type State = Record<string, CharacterDetailState>;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_START':
      if (state[action.characterId]?.status === 'loading') return state;
      return { ...state, [action.characterId]: { status: 'loading', detail: null, error: null } };
    case 'LOAD_SUCCESS':
      return { ...state, [action.characterId]: { status: 'success', detail: action.detail, error: null } };
    case 'LOAD_ERROR':
      return { ...state, [action.characterId]: { status: 'error', detail: null, error: action.error } };
  }
}

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [characters, dispatch] = useReducer(reducer, {});

  const load = useCallback(async (membershipId: string, characterId: string) => {
    dispatch({ type: 'LOAD_START', characterId });
    try {
      const detail = await loadCharacterDetail(membershipId, characterId);
      dispatch({ type: 'LOAD_SUCCESS', characterId, detail });
    } catch (err) {
      dispatch({
        type: 'LOAD_ERROR',
        characterId,
        error: err instanceof Error ? err.message : '加载失败',
      });
    }
  }, []);

  const getState = useCallback(
    (characterId: string): CharacterDetailState => characters[characterId] ?? IDLE,
    [characters]
  );

  return (
    <CharacterContext.Provider value={{ characters, load, getState }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter(): CharacterContextValue {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error('useCharacter must be used within CharacterProvider');
  return ctx;
}
