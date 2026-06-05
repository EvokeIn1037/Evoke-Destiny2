export interface PvpActivity {
  activityHash: number;
  activityDirectorHash: number;
  standing: number;
  kills: number;
  deaths: number;
  assists: number;
  killsDeathsRatio: number;
  killsDeathsAssists: number;
  efficiency: number;
  period: string;
}
