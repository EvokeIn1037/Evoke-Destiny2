import type { Translation } from '../types';

const t: Translation = {
  nav: {
    home: '主页',
    character: '个人数据',
    pvp: 'pvp查询',
    raid: '突袭查询',
    hash: 'hash查询',
    brand: "evoke's destiny",
  },
  search: {
    placeholder: '输入Bungie名称（例如 守护者#1234）',
    button: '搜索',
    loading: '搜索中...',
    error: '搜索失败',
    notFound: '未找到玩家',
  },
  language: {
    select: '选择语言',
    label: '语言',
  },
  common: {
    loading: '加载中...',
    error: '发生错误',
    retry: '重试',
    noData: '暂无数据',
  },
};

export default t;
