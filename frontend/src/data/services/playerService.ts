import { apiClient } from '@/data/config/api';
import type { PlayerProfile } from '@/domain/types/player';
import { encodeBungieName } from '@/shared/utils/bungieName';

export async function searchPlayer(name: string): Promise<PlayerProfile> {
  const encoded = encodeBungieName(name);
  return apiClient.get<PlayerProfile>(`/api/player/search?name=${encoded}`);
}
