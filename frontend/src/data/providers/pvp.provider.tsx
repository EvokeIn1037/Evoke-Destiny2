import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { PvpContextValue, PvpDataState } from './pvp.type';
import type { PvpActivity } from '@/domain/types/pvp';
import { loadPvpActivities } from '@/data/services/pvpService';

const PvpContext = createContext<PvpContextValue | null>(null);

const IDLE: PvpDataState = { status: 'idle', activities: [], error: null };

function makeKey(characterId: string, mode: number) {
  return `${characterId}:${mode}`;
}

type Action =
  | { type: 'LOAD_START'; key: string }
  | { type: 'LOAD_SUCCESS'; key: string; activities: PvpActivity[] }
  | { type: 'LOAD_ERROR'; key: string; error: string };

type State = Record<string, PvpDataState>;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_START':
      if (state[action.key]?.status === 'loading') return state;
      return { ...state, [action.key]: { status: 'loading', activities: [], error: null } };
    case 'LOAD_SUCCESS':
      return { ...state, [action.key]: { status: 'success', activities: action.activities, error: null } };
    case 'LOAD_ERROR':
      return { ...state, [action.key]: { status: 'error', activities: [], error: action.error } };
  }
}

export function PvpProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(reducer, {});

  const load = useCallback(async (membershipId: string, characterId: string, mode: number) => {
    const key = makeKey(characterId, mode);
    dispatch({ type: 'LOAD_START', key });
    try {
      const activities = await loadPvpActivities(membershipId, characterId, mode);
      dispatch({ type: 'LOAD_SUCCESS', key, activities });
    } catch (err) {
      dispatch({
        type: 'LOAD_ERROR',
        key,
        error: err instanceof Error ? err.message : '加载失败',
      });
    }
  }, []);

  const getState = useCallback(
    (characterId: string, mode: number): PvpDataState =>
      data[makeKey(characterId, mode)] ?? IDLE,
    [data]
  );

  return (
    <PvpContext.Provider value={{ data, load, getState }}>
      {children}
    </PvpContext.Provider>
  );
}

export function usePvp(): PvpContextValue {
  const ctx = useContext(PvpContext);
  if (!ctx) throw new Error('usePvp must be used within PvpProvider');
  return ctx;
}
