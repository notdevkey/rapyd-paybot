import { getHostname } from '@/utils/hostname';
import { useQuery } from '@tanstack/react-query';
import Pocketbase from 'pocketbase';
import { createContext, PropsWithChildren } from 'react';

export const PocketbaseContext = createContext<Pocketbase>(undefined);

export default function PocketbaseProvider({
  children,
}: PropsWithChildren<unknown>) {
  const { data: client } = useQuery(['pocketbase'], async () => {
    return new Pocketbase(getHostname());
  });
  return (
    <PocketbaseContext.Provider value={client}>
      {children}
    </PocketbaseContext.Provider>
  );
}
