import type { Translation } from '../types';

const t: Translation = {
  nav: {
    home: 'Inicio',
    character: 'Estadísticas',
    pvp: 'JcJ',
    raid: 'Incursiones',
    hash: 'Búsqueda Hash',
    brand: "evoke's destiny",
  },
  home: {
    title: "evoke's destiny finder",
    subtitle: 'Datos de personaje, estadísticas de armas y más',
  },
  character: {
    pageTitle: 'Estadísticas',
    hint: 'Ingresa tu nombre Bungie para comenzar',
    weapons: 'Armas',
    armor: 'Armadura',
    classInfo: 'Clase',
    description: 'Descripción',
    lastPlayed: 'Última vez jugado',
    playTime: 'Tiempo jugado',
    lightLevel: 'Nivel de luz',
  },
  clan: {
    title: 'Info del clan',
    membersCount: '{{count}} miembros',
    motto: 'LEMA: ',
    about: 'ACERCA DE: ',
  },
  search: {
    placeholder: 'Ingresa nombre Bungie (ej. Guardián#1234)',
    button: 'Buscar',
    loading: 'Buscando...',
    error: 'Error en la búsqueda',
    notFound: 'Jugador no encontrado',
  },
  language: {
    select: 'Seleccionar idioma',
    label: 'Idioma',
  },
  common: {
    loading: 'Cargando...',
    error: 'Ocurrió un error',
    retry: 'Reintentar',
    noData: 'Sin datos disponibles',
    hour: 'h',
    minute: 'min',
  },
};

export default t;
