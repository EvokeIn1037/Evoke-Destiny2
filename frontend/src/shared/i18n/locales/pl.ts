import type { Translation } from '../types';

const t: Translation = {
  nav: {
    home: 'Strona główna',
    character: 'Statystyki',
    pvp: 'PvP',
    raid: 'Rajdy',
    hash: 'Wyszukiwanie Hash',
    brand: "evoke's destiny",
  },
  search: {
    placeholder: 'Podaj nazwę Bungie (np. Strażnik#1234)',
    button: 'Szukaj',
    loading: 'Szukanie...',
    error: 'Błąd wyszukiwania',
    notFound: 'Nie znaleziono gracza',
  },
  language: {
    select: 'Wybierz język',
    label: 'Język',
  },
  common: {
    loading: 'Ładowanie...',
    error: 'Wystąpił błąd',
    retry: 'Spróbuj ponownie',
    noData: 'Brak danych',
  },
};

export default t;
