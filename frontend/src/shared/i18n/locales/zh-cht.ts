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
  },
};

export default t;
