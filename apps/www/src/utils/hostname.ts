import { validateEnv } from './validate-env';

export function getHostname() {
  if (!validateEnv()) return;
  return process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_HOSTNAME_DEV
    : process.env.NEXT_PUBLIC_HOSTNAME_PROD;
}
