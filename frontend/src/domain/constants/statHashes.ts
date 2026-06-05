import type { CharacterStats } from '@/domain/types/player';

export const STAT_HASHES: Record<string, string> = {
  mobility: '2996146975',
  resilience: '392767087',
  recovery: '1943323491',
  discipline: '1735777505',
  intellect: '144602215',
  strength: '4244567218',
};

export function mapRawStats(rawStats: Record<string, number>): CharacterStats {
  return {
    mobility: rawStats[STAT_HASHES.mobility] ?? 0,
    resilience: rawStats[STAT_HASHES.resilience] ?? 0,
    recovery: rawStats[STAT_HASHES.recovery] ?? 0,
    discipline: rawStats[STAT_HASHES.discipline] ?? 0,
    intellect: rawStats[STAT_HASHES.intellect] ?? 0,
    strength: rawStats[STAT_HASHES.strength] ?? 0,
  };
}
