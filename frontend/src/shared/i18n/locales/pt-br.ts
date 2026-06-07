import type { Translation } from '../types';

const t: Translation = {
  nav: {
    home: 'Início',
    character: 'Estatísticas',
    pvp: 'PvP',
    raid: 'Incursões',
    hash: 'Busca Hash',
    brand: "evoke's destiny",
  },
  home: {
    title: "evoke's destiny finder",
    subtitle: 'Dados do personagem, estatísticas de armas e mais',
  },
  character: {
    pageTitle: 'Estatísticas',
    hint: 'Digite seu nome Bungie para começar',
    weapons: 'Armas',
    armor: 'Armadura',
    classInfo: 'Classe',
    description: 'Descrição',
    lastPlayed: 'Último acesso',
    playTime: 'Tempo jogado',
    lightLevel: 'Nível de luz',
  },
  clan: {
    title: 'Info do clã',
    membersCount: '{{count}} membros',
    motto: 'LEMA: ',
    about: 'SOBRE NÓS: ',
  },
  search: {
    placeholder: 'Digite o nome Bungie (ex. Guardião#1234)',
    button: 'Buscar',
    loading: 'Buscando...',
    error: 'Falha na busca',
    notFound: 'Jogador não encontrado',
  },
  language: {
    select: 'Selecionar idioma',
    label: 'Idioma',
  },
  common: {
    loading: 'Carregando...',
    error: 'Ocorreu um erro',
    retry: 'Tentar novamente',
    noData: 'Sem dados disponíveis',
    hour: 'h',
    minute: 'min',
  },
};

export default t;
