import PocketbaseProvider from '@/contexts/pocketbase.context';
import RapydAxiosProvider from '@/contexts/rapyd-axios.context';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProps } from 'next/app';
import Head from 'next/head';

const queryClient = new QueryClient();

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to www!</title>
      </Head>
      <main className="app">
        <QueryClientProvider client={queryClient}>
          <RapydAxiosProvider>
            <PocketbaseProvider>
              <Component {...pageProps} />
            </PocketbaseProvider>
          </RapydAxiosProvider>
        </QueryClientProvider>
      </main>
    </>
  );
}

export default CustomApp;
