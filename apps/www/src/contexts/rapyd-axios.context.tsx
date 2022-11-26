import { validateEnv } from '@/utils/validate-env';
import { getRequestHeaders } from '@rapyd-paybot/rapyd';
import axios, { Axios } from 'axios';
import { createContext, useMemo } from 'react';

export const RapydAxiosContext = createContext<Axios>(undefined);

export default function RapydAxiosProvider({
  children,
}: React.PropsWithChildren<unknown>) {
  const axiosClient = useMemo(() => {
    if (!validateEnv) return;
    axios.interceptors.request.use(
      (config) => {
        // TODO: implement working headers
        const headers = getRequestHeaders(
          config.method,
          config.url,
          config.data,
          process.env.NEXT_PUBLIC_SECRET_KEY,
          process.env.NEXT_PUBLIC_ACCESS_KEY
        );

        config.baseURL = 'https://sandboxapi.rapyd.net/v1/';
        config.headers['Content-Type'] = headers['Content-Type'];
        config.headers['access_key'] = headers.accessKey;
        config.headers['salt'] = headers.salt.toString();
        config.headers['timestamp'] = headers.timestamp;
        config.headers['signature'] = headers.signature;
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
