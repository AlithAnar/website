import type { User as NextAuthUser } from 'next-auth';
import { useSession } from 'next-auth/client';
import Head from 'next/head';
import Link from 'next/link';
import * as React from 'react';
import type { ReactElement } from 'react';

import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from '../styles/Home.module.css';

import Player from './Player';
import SideBarMenu from './SideBarMenu';

interface LayoutParams {
  title: string;
  description?: string;
  keywords?: string;
  children: ReactElement;
}

interface IExtendedNextAuthUser extends NextAuthUser {
  token: string;
}

function Layout({ title, description, keywords, children }: LayoutParams): ReactElement {
  const [session, loading] = useSession();
  useDocumentTitle(title);

  return (
    <>
      <Head>
        <title>{title} · Minarets</title>
        {description && <meta name="description" content={description} />}
        {keywords && <meta name="keywords" content={keywords} />}
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={session ? styles.playerVisible : ''}>
        <div className="flex-grow-1">
          <header className="navbar navbar-dark bg-dark flex-md-nowrap p-0 shadow">
            <Link href="/">
              <a className="navbar-brand col-md-3 col-lg-2 mr-0 px-3">Home</a>
            </Link>
            <button
              className="navbar-toggler position-absolute d-md-none collapsed"
              type="button"
              data-toggle="collapse"
              data-target="#sidebarMenu"
              aria-controls="sidebarMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <input className="form-control form-control-dark w-100" type="text" placeholder="Search for concerts by date, songs, venues..." aria-label="Search" />
            <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap">
                <Link href="/concerts/random">
                  <a className="nav-link" title="Random concert">
                    <img src="/random.svg" alt="Random concert" />
                  </a>
                </Link>
              </li>
              {!session && !loading && (
                <Link href="/api/auth/signin">
                  <a className="nav-link" title="Login">
                    Login
                  </a>
                </Link>
              )}
              {session && !loading && session.user && session.user.image && (
                <img className="img-fluid" src={session.user.image} alt={`${session.user.name || ''} - ${(session.user as IExtendedNextAuthUser).token}`} />
              )}
            </ul>
          </header>

          <div className="container-fluid">
            <div className="row">
              <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                <SideBarMenu />
              </nav>

              <main className="col-md-9 ml-sm-auto col-lg-10 px-md-4">{children}</main>
            </div>
          </div>
        </div>

        <footer className="flex-shrink-0">
          <div className="footer mt-auto py-3 bg-light shadow sticky-xl-bottom">
            <div className="container-fluid">
              <div className="row">
                <div className="col text-start">
                  <a className="navbar-brand" href="https://vercel.com?utm_source=minarets&utm_campaign=oss" target="_blank" rel="noopener noreferrer">
                    <img src="/powered-by-vercel.svg" alt="Powered by Vercel" className={styles.logo} />
                  </a>
                </div>
                <div className="col text-end">
                  <a className="navbar-brand" href="https://github.com/minarets/website" target="_blank" rel="noopener noreferrer">
                    <img src="/github.svg" alt="Open Source" className={styles.logo} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <Player />
    </>
  );
}

Layout.defaultProps = {
  description: '',
  keywords: '',
};

export default Layout;
