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
    hint: 'Introduce tu nombre Bungie para comenzar',
  },
  search: {
    placeholder: 'Introduce nombre Bungie (ej. Guardián#1234)',
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
    error: 'Se produjo un error',
    retry: 'Reintentar',
    noData: 'Sin datos disponibles',
  },
};

export default t;
