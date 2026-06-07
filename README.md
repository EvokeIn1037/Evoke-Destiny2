## TODO

- [ ] Search/query functionality is not yet optimized
- [ ] The world_sql_content.sqlite file needs to be replaced periodically

## Legacy Mapping of Character Stat Labels
```typescript
const STAT_FIELDS: [string, keyof CharacterStats][] = [
  ['敏捷', 'mobility'],
  ['韧性', 'resilience'],
  ['恢复', 'recovery'],
  ['纪律', 'discipline'],
  ['智慧', 'intellect'],
  ['力量', 'strength'],
];
```
