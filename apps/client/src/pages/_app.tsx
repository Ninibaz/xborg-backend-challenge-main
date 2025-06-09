import { CacheProvider, EmotionCache, ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AppProps as NextAppProps } from 'next/app';
import Head from 'next/head';
import { Layout } from '../layouts/layout';
import { UserSessionProvider } from '../providers/user-session.provider';
import '../styles/global.css';
import { themeSettings } from '../styles/theme';
import { createEmotionCache } from '../utils/emotion';

const clientSideEmotionCache = createEmotionCache();

interface AppProps extends NextAppProps {
  emotionCache?: EmotionCache;
}

const App = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  const theme = createTheme(themeSettings);

  return (
    <UserSessionProvider>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>XBorg</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </CacheProvider>
    </UserSessionProvider>
  );
};

export default App;
