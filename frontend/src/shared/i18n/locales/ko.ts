import type { Translation } from '../types';

const t: Translation = {
  nav: {
    home: '홈',
    character: '플레이어 통계',
    pvp: 'PvP',
    raid: '레이드',
    hash: 'Hash 검색',
    brand: "evoke's destiny",
  },
  home: {
    title: "evoke's destiny finder",
    subtitle: '캐릭터 데이터, 무기 통계 등 조회',
  },
  character: {
    pageTitle: '플레이어 통계',
    hint: 'Bungie 이름을 입력하여 시작하세요',
    weapons: '무기',
    armor: '방어구',
  },
  clan: {
    membersCount: '멤버 {{count}}명',
    motto: '모토',
    about: '소개',
  },
  search: {
    placeholder: 'Bungie 이름 입력 (예: 수호자#1234)',
    button: '검색',
    loading: '검색 중...',
    error: '검색 실패',
    notFound: '플레이어를 찾을 수 없습니다',
  },
  language: {
    select: '언어 선택',
    label: '언어',
  },
  common: {
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
    retry: '다시 시도',
    noData: '데이터 없음',
  },
};

export default t;
