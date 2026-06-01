export const ROUTES = {
  HOME: '/',
  CHARACTER: '/character',
  PVP: '/pvp',
  RAID: '/raid',
  HASH: '/hash',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
