// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, June 14th 2023, 3:17:57 pm
 * Author: Nagendra S @ valmi.io
 */

import { FC, ReactElement, ReactNode, useEffect } from 'react';

import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ThemeProviderWrapper from '@/theme/ThemeProviderWrapper';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from 'src/createEmotionCache';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { PersistGate } from 'redux-persist/integration/react';

import { AppDispatch, AppState, wrapper } from 'src/store/store';
import { useDispatch, useStore } from 'react-redux';
import { setAppState } from '../src/store/reducers/appFlow';

const clientSideEmotionCache = createEmotionCache();

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
};

const MyApp: FC<AppPropsWithLayout> = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps
}) => {
  const store = useStore();

  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleRouteChange = ({ shallow }: { shallow: boolean }) => {
      if (!shallow) {
        NProgress.start();
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', () => NProgress.done());
    router.events.on('routeChangeError', () => NProgress.done());

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', () => NProgress.done());
      router.events.off('routeChangeError', () => NProgress.done());
    };
  }, []);

  useEffect(() => {
    const appState: AppState = (store.getState() as any).appFlow.appState;

    const currentRouteInStore = appState.currentRoute;
    const currentRoute = router.pathname.split('/').slice(-1)[0];
    if (
      currentRoute !== 'create' &&
      currentRoute !== 'callback' &&
      currentRoute !== 'runs' &&
      currentRoute !== currentRouteInStore
    ) {
      dispatch(
        setAppState({
          ...appState,
          currentRoute: currentRoute
        })
      );
    }
    // }
  }, [router.pathname]);

  return (
    <PersistGate persistor={store.__persistor}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>
        <SidebarProvider>
          <ThemeProviderWrapper>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CssBaseline />
              {getLayout(<Component {...pageProps} />)}
            </LocalizationProvider>
          </ThemeProviderWrapper>
        </SidebarProvider>
      </CacheProvider>
    </PersistGate>
  );
};

export default wrapper.withRedux(MyApp);
