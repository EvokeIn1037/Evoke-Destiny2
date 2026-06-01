export const ROUTES = {
  HOME: '/',
  CHARACTER: '/character',
  PVP: '/pvp',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
