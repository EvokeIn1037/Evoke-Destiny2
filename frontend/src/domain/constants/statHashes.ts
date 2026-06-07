import type { CharacterStats } from '@/domain/types/player';

// Manifest displayProperties.name → CharacterStats field
// (manifest uses ability-effect names for the 6 guardian stats)
const MANIFEST_NAME_TO_STAT: Record<string, keyof CharacterStats> = {
  Weapons: 'mobility',
  Health: 'resilience',
  Class: 'recovery',
  Grenade: 'discipline',
  Super: 'intellect',
  Melee: 'strength',
};

export function mapRawStats(rawStats: Array<{ name: string; value: number }>): CharacterStats {
  const result: CharacterStats = { mobility: 0, resilience: 0, recovery: 0, discipline: 0, intellect: 0, strength: 0 };
  for (const { name, value } of rawStats) {
    const field = MANIFEST_NAME_TO_STAT[name];
    if (field) result[field] = value;
  }
  return result;
}
