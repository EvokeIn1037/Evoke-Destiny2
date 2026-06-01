import { apiClient } from '@/data/config/api';
import type { PvpActivity } from '@/domain/types/pvp';

export async function loadPvpActivities(
  membershipId: string,
  characterId: string,
  mode: number
): Promise<PvpActivity[]> {
  return apiClient.get<PvpActivity[]>(
    `/api/pvp/${membershipId}/${characterId}?mode=${mode}`
  );
}
