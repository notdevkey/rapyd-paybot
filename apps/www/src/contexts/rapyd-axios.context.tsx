import { validateEnv } from '@/utils/validate-env';
import axios, { Axios } from 'axios';
import { createContext, useMemo } from 'react';

export const RapydAxiosContext = createContext<Axios>(undefined);

export default function AxiosProvider({
  children,
}: React.PropsWithChildren<unknown>) {
  const axiosClient = useMemo(() => {
    if (!validateEnv) return;
    axios.interceptors.request.use(
      (config) => {
        // TODO: implement working headers
        config.headers['Content-Type'] = 'application/json';
        config.headers['access_key'] = '';
        config.headers['salt'] = '';
        config.headers['timestamp'] = Date.now();
        config.headers['signature'] = '';
        return config;
      },
      (err) => Promise.reject(err)
    );

    return axios;
  }, []);

  return (
    <RapydAxiosContext.Provider value={axiosClient}>
      {children}
    </RapydAxiosContext.Provider>
  );
}
