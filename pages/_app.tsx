import type { Session } from 'next-auth/client';
import { Provider } from 'next-auth/client';
import type { AppProps } from 'next/app';
import type { ReactElement } from 'react';
import * as React from 'react';

import '../styles/globals.scss';
import { QueueContextProvider } from '../contexts/QueueContext';

interface IPageProps {
  session: Session;
}

function App({ Component, pageProps }: AppProps<IPageProps>): ReactElement {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
  const session: Session = pageProps.session;

  return (
    <Provider session={session}>
      <QueueContextProvider>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </QueueContextProvider>
    </Provider>
  );
}

export default App;
