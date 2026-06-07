import type { Translation } from '../types';

const t: Translation = {
  nav: {
    home: 'Home',
    character: 'Statistiche',
    pvp: 'JcG',
    raid: 'Raid',
    hash: 'Ricerca Hash',
    brand: "evoke's destiny",
  },
  home: {
    title: "evoke's destiny finder",
    subtitle: "Dati del personaggio, statistiche delle armi e altro",
  },
  character: {
    pageTitle: 'Statistiche',
    hint: 'Inserisci il tuo nome Bungie per iniziare',
    weapons: 'Armi',
    armor: 'Armatura',
  },
  clan: {
    membersCount: '{{count}} membri',
    motto: 'MOTTO',
    about: 'CHI SIAMO',
  },
  search: {
    placeholder: 'Inserisci nome Bungie (es. Guardiano#1234)',
    button: 'Cerca',
    loading: 'Ricerca...',
    error: 'Ricerca fallita',
    notFound: 'Giocatore non trovato',
  },
  language: {
    select: 'Seleziona lingua',
    label: 'Lingua',
  },
  common: {
    loading: 'Caricamento...',
    error: 'Si è verificato un errore',
    retry: 'Riprova',
    noData: 'Nessun dato disponibile',
  },
};

export default t;
