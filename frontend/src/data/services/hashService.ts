import { apiClient } from '@/data/config/api';

export interface HashResult {
  name: string;
  iconPath: string;
  type: string;
}

export async function lookupHash(hash: string, lang = 'en'): Promise<HashResult> {
  const value = encodeURIComponent(hash.trim());
  return apiClient.get<HashResult>(`/api/manifest/hash/${value}?lang=${lang}`);
}

export async function batchResolveHashes(hashes: number[], lang = 'en'): Promise<Record<string, string>> {
  if (hashes.length === 0) return {};
  const joined = hashes.join(',');
  return apiClient.get<Record<string, string>>(`/api/manifest/batch?hashes=${joined}&lang=${lang}`);
}
