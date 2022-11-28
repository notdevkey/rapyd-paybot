import { RapydAxiosContext } from '@/contexts/rapyd-axios.context';
import { useContext } from 'react';

export function useRapydAxios() {
  return useContext(RapydAxiosContext);
}
