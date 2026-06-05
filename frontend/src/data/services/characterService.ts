import { apiClient } from '@/data/config/api';
import type { CharacterDetail, ClassType, RaceType, GenderType, GearItem } from '@/domain/types/player';
import { mapRawStats } from '@/domain/constants/statHashes';
import { BUCKET_TO_SLOT, slotRank } from '@/domain/constants/bucketSlots';

interface RawCharacterDetail {
  characterId: string;
  classType: number;
  raceType: number;
  genderType: number;
  light: number;
  emblemBackgroundPath: string;
  dateLastPlayed: string;
  minutesPlayedTotal: number;
  stats: Record<string, number>;
  gear: GearItem[];
}

export async function loadCharacterDetail(
  membershipId: string,
  characterId: string
): Promise<CharacterDetail> {
  const raw = await apiClient.get<RawCharacterDetail>(
    `/api/character/${membershipId}/${characterId}`
  );

  const stats = mapRawStats(raw.stats);

  const gear = raw.gear
    .filter(item => item.bucketHash in BUCKET_TO_SLOT)
    .sort((a, b) =>
      slotRank(BUCKET_TO_SLOT[a.bucketHash] ?? '') - slotRank(BUCKET_TO_SLOT[b.bucketHash] ?? '')
    );

  return {
    characterId: raw.characterId,
    classType: raw.classType as ClassType,
    raceType: raw.raceType as RaceType,
    genderType: raw.genderType as GenderType,
    light: raw.light,
    emblemBackgroundPath: raw.emblemBackgroundPath,
    dateLastPlayed: raw.dateLastPlayed,
    minutesPlayedTotal: raw.minutesPlayedTotal,
    stats,
    gear,
  };
}
