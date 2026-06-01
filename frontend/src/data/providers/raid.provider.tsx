import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { RaidContextValue, RaidDataState } from './raid.type';
import type { RaidActivity } from '@/domain/types/raid';
import { loadRaidActivities } from '@/data/services/raidService';

const RaidContext = createContext<RaidContextValue | null>(null);

const IDLE: RaidDataState = { status: 'idle', activities: [], error: null };

function makeKey(characterId: string, mode: number) {
  return `${characterId}:${mode}`;
}

type Action =
  | { type: 'LOAD_START'; key: string }
  | { type: 'LOAD_SUCCESS'; key: string; activities: RaidActivity[] }
  | { type: 'LOAD_ERROR'; key: string; error: string };

type State = Record<string, RaidDataState>;

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

export function RaidProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(reducer, {});

  const load = useCallback(async (membershipId: string, characterId: string, mode: number) => {
    const key = makeKey(characterId, mode);
    dispatch({ type: 'LOAD_START', key });
    try {
      const activities = await loadRaidActivities(membershipId, characterId, mode);
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
    (characterId: string, mode: number): RaidDataState =>
      data[makeKey(characterId, mode)] ?? IDLE,
    [data]
  );

  return (
    <RaidContext.Provider value={{ data, load, getState }}>
      {children}
    </RaidContext.Provider>
  );
}

export function useRaid(): RaidContextValue {
  const ctx = useContext(RaidContext);
  if (!ctx) throw new Error('useRaid must be used within RaidProvider');
  return ctx;
}
