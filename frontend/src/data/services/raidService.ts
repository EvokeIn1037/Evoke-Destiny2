import { apiClient } from '@/data/config/api';
import type { RaidActivity } from '@/domain/types/raid';

export async function loadRaidActivities(
  membershipId: string,
  characterId: string,
  mode: number
): Promise<RaidActivity[]> {
  return apiClient.get<RaidActivity[]>(
    `/api/raid/${membershipId}/${characterId}?mode=${mode}`
  );
}
