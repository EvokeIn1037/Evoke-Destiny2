import type { Translation } from '../types';

const t: Translation = {
  nav: {
    home: 'Home',
    character: 'Player Stats',
    pvp: 'PvP',
    raid: 'Raids',
    hash: 'Hash Lookup',
    brand: "evoke's destiny",
  },
  home: {
    title: "evoke's destiny finder",
    subtitle: 'Character data, weapon stats, and more',
  },
  character: {
    pageTitle: 'Player Stats',
    hint: 'Enter your Bungie name to get started',
    weapons: 'Weapons',
    armor: 'Armor',
  },
  clan: {
    membersCount: '{{count}} Members',
    motto: 'MOTTO',
    about: 'ABOUT US',
  },
  search: {
    placeholder: 'Enter Bungie name (e.g. Guardian#1234)',
    button: 'Search',
    loading: 'Searching...',
    error: 'Search failed',
    notFound: 'Player not found',
  },
  language: {
    select: 'Select language',
    label: 'Language',
  },
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    noData: 'No data available',
  },
};

export default t;
