export interface PvpActivity {
  activityHash: number;
  mapName: string;
  kills: number;
  deaths: number;
  assists: number;
  killsDeathsRatio: number;
  killsDeathsAssists: number;
  efficiency: number;
  period: string;
  isTrialsLab: boolean;
}
