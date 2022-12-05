import { PocketbaseContext } from '@/contexts/pocketbase.context';
import { useContext } from 'react';

export function usePocketbase() {
  return useContext(PocketbaseContext);
}
