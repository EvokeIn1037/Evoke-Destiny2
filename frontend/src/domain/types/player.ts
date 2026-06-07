export type ClassType = 0 | 1 | 2;
export type RaceType = 0 | 1 | 2;
export type GenderType = 0 | 1;

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
  class_name: string;
  race_name: string;
}

export interface CharacterDetail extends Omit<Character, 'stats'> {
  stats: Array<{ name: string; value: number }>;
  gear: GearItem[];
  race_description: string;
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
