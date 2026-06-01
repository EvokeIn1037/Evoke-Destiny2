import type { ReactNode } from 'react';
import { PlayerProvider } from '@/data/providers/player.provider';
import { CharacterProvider } from '@/data/providers/character.provider';
import { PvpProvider } from '@/data/providers/pvp.provider';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <PlayerProvider>
      <CharacterProvider>
        <PvpProvider>
          {children}
        </PvpProvider>
      </CharacterProvider>
    </PlayerProvider>
  );
}
