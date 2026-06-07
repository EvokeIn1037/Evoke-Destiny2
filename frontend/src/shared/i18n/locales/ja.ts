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
  home: {
    title: "evoke's destiny finder",
    subtitle: 'キャラクターデータ、武器統計などを照会',
  },
  character: {
    pageTitle: 'プレイヤー統計',
    hint: 'Bungie名を入力して始めてください',
    weapons: '武器',
    armor: '防具',
    classInfo: 'クラス',
    description: '説明',
    lastPlayed: '最終プレイ日時',
    playTime: 'プレイ時間',
    lightLevel: 'ライトレベル',
  },
  clan: {
    title: 'クラン情報',
    membersCount: '{{count}} 名のメンバー',
    motto: 'モットー: ',
    about: '私たちについて: ',
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
    hour: '時間',
    minute: '分',
  },
};

export default t;
