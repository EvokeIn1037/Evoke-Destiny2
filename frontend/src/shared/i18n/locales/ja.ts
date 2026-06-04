import type { Translation } from '../types';

const t: Translation = {
  nav: {
    home: 'ホーム',
    character: 'プレイヤー統計',
    pvp: 'PvP',
    raid: 'レイド',
    hash: 'ハッシュ検索',
    brand: "evoke's destiny",
  },
  search: {
    placeholder: 'Bungie名を入力（例：ガーディアン#1234）',
    button: '検索',
    loading: '検索中...',
    error: '検索に失敗しました',
    notFound: 'プレイヤーが見つかりません',
  },
  language: {
    select: '言語を選択',
    label: '言語',
  },
  common: {
    loading: '読み込み中...',
    error: 'エラーが発生しました',
    retry: '再試行',
    noData: 'データがありません',
  },
};

export default t;
