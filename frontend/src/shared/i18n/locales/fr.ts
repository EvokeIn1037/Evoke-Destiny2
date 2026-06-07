import type { Translation } from '../types';

const t: Translation = {
  nav: {
    home: 'Accueil',
    character: 'Stats du joueur',
    pvp: 'JcJ',
    raid: 'Raids',
    hash: 'Recherche Hash',
    brand: "evoke's destiny",
  },
  home: {
    title: "evoke's destiny finder",
    subtitle: "Données de personnage, statistiques d'armes, et plus",
  },
  character: {
    pageTitle: 'Stats du joueur',
    hint: 'Entrez votre nom Bungie pour commencer',
    weapons: 'Armes',
    armor: 'Armure',
  },
  clan: {
    membersCount: '{{count}} membres',
    motto: 'DEVISE',
    about: 'À PROPOS',
  },
  search: {
    placeholder: 'Entrez le nom Bungie (ex. Gardien#1234)',
    button: 'Rechercher',
    loading: 'Recherche...',
    error: 'Échec de la recherche',
    notFound: 'Joueur introuvable',
  },
  language: {
    select: 'Choisir la langue',
    label: 'Langue',
  },
  common: {
    loading: 'Chargement...',
    error: 'Une erreur est survenue',
    retry: 'Réessayer',
    noData: 'Aucune donnée disponible',
  },
};

export default t;
