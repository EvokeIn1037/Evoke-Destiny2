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
  home: {
    title: "evoke's destiny finder",
    subtitle: 'Dane postaci, statystyki broni i więcej',
  },
  character: {
    pageTitle: 'Statystyki',
    hint: 'Wpisz swoją nazwę Bungie, aby rozpocząć',
    weapons: 'Broń',
    armor: 'Zbroja',
  },
  clan: {
    membersCount: '{{count}} członków',
    motto: 'MOTTO',
    about: 'O NAS',
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
