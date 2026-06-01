import { apiClient } from '@/data/config/api';
import type { CharacterDetail } from '@/domain/types/player';

export async function loadCharacterDetail(
  membershipId: string,
  characterId: string
): Promise<CharacterDetail> {
  return apiClient.get<CharacterDetail>(`/api/character/${membershipId}/${characterId}`);
}
