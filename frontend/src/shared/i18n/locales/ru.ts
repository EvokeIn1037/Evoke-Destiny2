import type { Translation } from '../types';

const t: Translation = {
  nav: {
    home: 'Главная',
    character: 'Статистика',
    pvp: 'PvP',
    raid: 'Рейды',
    hash: 'Поиск Hash',
    brand: "evoke's destiny",
  },
  search: {
    placeholder: 'Введите имя Bungie (напр. Страж#1234)',
    button: 'Поиск',
    loading: 'Поиск...',
    error: 'Ошибка поиска',
    notFound: 'Игрок не найден',
  },
  language: {
    select: 'Выбрать язык',
    label: 'Язык',
  },
  common: {
    loading: 'Загрузка...',
    error: 'Произошла ошибка',
    retry: 'Повторить',
    noData: 'Нет данных',
  },
};

export default t;
