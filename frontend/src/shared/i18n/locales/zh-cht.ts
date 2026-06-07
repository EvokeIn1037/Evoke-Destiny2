import type { Translation } from '../types';

const t: Translation = {
  nav: {
    home: '主頁',
    character: '個人數據',
    pvp: 'PvP查詢',
    raid: '突襲查詢',
    hash: 'Hash查詢',
    brand: "evoke's destiny",
  },
  home: {
    title: "evoke's destiny finder",
    subtitle: '個人數據、武器數據查詢等功能',
  },
  character: {
    pageTitle: '個人數據',
    hint: '請輸入Bungie暱稱',
    weapons: '武器',
    armor: '防具',
    classInfo: '職業',
    description: '簡介',
    lastPlayed: '上次登入時間',
    playTime: '遊戲時長',
    lightLevel: '光等',
  },
  clan: {
    title: '公會資訊',
    membersCount: '{{count}} 名成員',
    motto: 'MOTTO: ',
    about: '關於我們: ',
  },
  search: {
    placeholder: '輸入Bungie名稱（例如 守護者#1234）',
    button: '搜尋',
    loading: '搜尋中...',
    error: '搜尋失敗',
    notFound: '找不到玩家',
  },
  language: {
    select: '選擇語言',
    label: '語言',
  },
  common: {
    loading: '載入中...',
    error: '發生錯誤',
    retry: '重試',
    noData: '暫無數據',
    hour: '小時',
    minute: '分鐘',
  },
};

export default t;
