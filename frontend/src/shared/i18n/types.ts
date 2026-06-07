export interface Translation {
  nav: {
    home: string;
    character: string;
    pvp: string;
    raid: string;
    hash: string;
    brand: string;
  };
  home: {
    title: string;
    subtitle: string;
  };
  character: {
    pageTitle: string;
    hint: string;
    weapons: string;
    armor: string;
    classInfo: string;
    description: string;
    lastPlayed: string;
    playTime: string;
    lightLevel: string;
  };
  clan: {
    title: string;
    membersCount: string;
    motto: string;
    about: string;
  };
  search: {
    placeholder: string;
    button: string;
    loading: string;
    error: string;
    notFound: string;
  };
  language: {
    select: string;
    label: string;
  };
  common: {
    loading: string;
    error: string;
    retry: string;
    noData: string;
    hour: string;
    minute: string;
  };
}
