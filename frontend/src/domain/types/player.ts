export type ClassType = 0 | 1 | 2;
export type RaceType = 0 | 1 | 2;
export type GenderType = 0 | 1;

export const CLASS_NAMES: Record<ClassType, string> = {
  0: '泰坦',
  1: '猎人',
  2: '术士',
};

export const RACE_NAMES: Record<RaceType, string> = {
  0: '人类',
  1: '觉醒者',
  2: 'EXO',
};

export const GENDER_NAMES: Record<GenderType, string> = {
  0: '男性',
  1: '女性',
};

export interface CharacterStats {
  mobility: number;
  resilience: number;
  recovery: number;
  discipline: number;
  intellect: number;
  strength: number;
}

export interface GearItem {
  itemHash: number;
  bucketHash: number;
  name: string;
  iconPath: string;
  light: number;
}

export interface Character {
  characterId: string;
  classType: ClassType;
  raceType: RaceType;
  genderType: GenderType;
  light: number;
  emblemBackgroundPath: string;
  dateLastPlayed: string;
  minutesPlayedTotal: number;
  stats: Record<string, number>;
}

export interface CharacterDetail extends Omit<Character, 'stats'> {
  stats: CharacterStats;
  gear: GearItem[];
  race_name: string;
  race_description: string;
  class_name: string;
}

export interface ClanInfo {
  name: string;
  callsign: string;
  memberCount: number;
  motto: string;
  about: string;
  bannerPath: string;
}

export interface PlayerProfile {
  membershipId: string;
  membershipType: number;
  displayName: string;
  characters: Character[];
  clan: ClanInfo | null;
}
