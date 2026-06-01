export interface RaidMode {
  id: number;
  label: string;
}

export const RAID_MODES: RaidMode[] = [
  { id: 2029, label: '利维坦' },
  { id: 2074, label: '世界吞噬者' },
  { id: 2078, label: '星之塔' },
  { id: 2082, label: '往日之苦' },
  { id: 2090, label: '守护者陵墓' },
  { id: 2119, label: '圣盔甲兵工厂' },
  { id: 2136, label: '幽灵深渊' },
  { id: 2160, label: '誓言之地' },
  { id: 2173, label: '沃克之痕' },
  { id: 2185, label: '国王坠落' },
  { id: 2193, label: '救赎根源' },
  { id: 2211, label: '救恩之边' },
];

export const RAID_MODE_MAP = Object.fromEntries(
  RAID_MODES.map((m) => [m.id, m.label])
) as Record<number, string>;
