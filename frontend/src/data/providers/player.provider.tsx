import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { PlayerContextValue, PlayerState } from './player.type';
import type { PlayerProfile } from '@/domain/types/player';
import { searchPlayer } from '@/data/services/playerService';

const PlayerContext = createContext<PlayerContextValue | null>(null);

type Action =
  | { type: 'SEARCH_START' }
  | { type: 'SEARCH_SUCCESS'; profile: PlayerProfile }
  | { type: 'SEARCH_ERROR'; error: string }
  | { type: 'RESET' };

const initial: PlayerState = { status: 'idle', profile: null, error: null };

function reducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case 'SEARCH_START':
      return { status: 'loading', profile: null, error: null };
    case 'SEARCH_SUCCESS':
      return { status: 'success', profile: action.profile, error: null };
    case 'SEARCH_ERROR':
      return { status: 'error', profile: null, error: action.error };
    case 'RESET':
      return initial;
  }
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const search = useCallback(async (name: string) => {
    dispatch({ type: 'SEARCH_START' });
    try {
      const profile = await searchPlayer(name);
      dispatch({ type: 'SEARCH_SUCCESS', profile });
    } catch (err) {
      dispatch({
        type: 'SEARCH_ERROR',
        error: err instanceof Error ? err.message : '查询失败',
      });
    }
  }, []);

  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return (
    <PlayerContext.Provider value={{ ...state, search, reset }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
