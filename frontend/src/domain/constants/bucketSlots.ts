export type SlotName = 'kinetic' | 'energy' | 'power' | 'helmet' | 'gauntlets' | 'chest' | 'legs' | 'class';

export const BUCKET_TO_SLOT: Record<number, SlotName> = {
  1498876634: 'kinetic',
  2465295065: 'energy',
  953998645: 'power',
  3448274439: 'helmet',
  3551918588: 'gauntlets',
  14239492: 'chest',
  20886954: 'legs',
  1585787867: 'class',
};

export const SLOT_ORDER: SlotName[] = [
  'kinetic', 'energy', 'power',
  'helmet', 'gauntlets', 'chest', 'legs', 'class',
];

export function slotRank(slot: string): number {
  const idx = SLOT_ORDER.indexOf(slot as SlotName);
  return idx === -1 ? 99 : idx;
}
