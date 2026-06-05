export const TRIALS_MODE_ID = 84;
export const TRIALS_LAB_DIRECTOR_HASH = 1728343233;

export function isTrialsLab(modeId: number, directorActivityHash: number): boolean {
  return modeId === TRIALS_MODE_ID && directorActivityHash === TRIALS_LAB_DIRECTOR_HASH;
}
