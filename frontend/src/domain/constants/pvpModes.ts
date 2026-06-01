export interface PvpMode {
  id: number;
  label: string;
}

export const PVP_MODES: PvpMode[] = [
  { id: 10, label: '占领' },
  { id: 19, label: '铁旗' },
  { id: 25, label: '鏖战' },
  { id: 32, label: '私人比赛' },
  { id: 37, label: '生存' },
  { id: 43, label: '自由竞技：铁旗' },
  { id: 48, label: '混战' },
  { id: 62, label: '焦灼小队' },
  { id: 73, label: '占领qp' },
  { id: 80, label: '灭绝' },
  { id: 81, label: '趋势控制' },
  { id: 84, label: '奥斯里斯试炼' },
];

export const PVP_MODE_MAP = Object.fromEntries(
  PVP_MODES.map((m) => [m.id, m.label])
) as Record<number, string>;
