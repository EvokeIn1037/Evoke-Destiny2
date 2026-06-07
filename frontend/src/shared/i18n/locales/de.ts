import type { Translation } from '../types';

const t: Translation = {
  nav: {
    home: 'Startseite',
    character: 'Spielerstatistiken',
    pvp: 'PvP',
    raid: 'Raids',
    hash: 'Hash-Suche',
    brand: "evoke's destiny",
  },
  home: {
    title: "evoke's destiny finder",
    subtitle: 'Charakterdaten, Waffenstatistiken und mehr',
  },
  character: {
    pageTitle: 'Spielerstatistiken',
    hint: 'Gib deinen Bungie-Namen ein, um zu beginnen',
    weapons: 'Waffen',
    armor: 'Rüstung',
    classInfo: 'Klasse',
    description: 'Beschreibung',
    lastPlayed: 'Zuletzt gespielt',
    playTime: 'Spielzeit',
    lightLevel: 'Lichtstufe',
  },
  clan: {
    title: 'Clan-Info',
    membersCount: '{{count}} Mitglieder',
    motto: 'MOTTO: ',
    about: 'ÜBER UNS: ',
  },
  search: {
    placeholder: 'Bungie-Name eingeben (z.B. Hüter#1234)',
    button: 'Suchen',
    loading: 'Suche...',
    error: 'Suche fehlgeschlagen',
    notFound: 'Spieler nicht gefunden',
  },
  language: {
    select: 'Sprache auswählen',
    label: 'Sprache',
  },
  common: {
    loading: 'Laden...',
    error: 'Ein Fehler ist aufgetreten',
    retry: 'Erneut versuchen',
    noData: 'Keine Daten verfügbar',
    hour: 'Std',
    minute: 'Min',
  },
};

export default t;
