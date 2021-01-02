import type { GetStaticPropsResult } from 'next';
import * as React from 'react';
import type { ReactElement } from 'react';

import { Minarets } from '../../api/minarets';
import type { Compilation } from '../../api/minarets/types';
import CompilationLinkRow from '../../components/CompilationLinkRow';
import Layout from '../../components/Layout';

interface IProps {
  allCompilations: Compilation[];
  popularCompilations: Compilation[];
  recentCompilations: Compilation[];
}

export async function getStaticProps(): Promise<GetStaticPropsResult<IProps>> {
  const api = new Minarets();

  const [
    allCompilationResults, //
    popularCompilationResults,
    recentCompilationResults,
  ] = await Promise.all([
    api.compilations.listCompilations({
      sortAsc: 'Name',
      itemsPerPage: 30,
    }),
    api.compilations.listCompilations({
      sortDesc: 'Popular',
      itemsPerPage: 15,
    }),
    api.compilations.listCompilations({
      sortDesc: 'ModifiedOn',
      itemsPerPage: 15,
    }),
  ]);

  return {
    props: {
      allCompilations: allCompilationResults.items,
      popularCompilations: popularCompilationResults.items,
      recentCompilations: recentCompilationResults.items,
    },
    // Re-generate the data at most every 24 hours
    revalidate: 86400,
  };
}

export default function Page({ allCompilations, popularCompilations, recentCompilations }: IProps): ReactElement {
  return (
    <Layout title="Compilations">
      <section className="row">
        <div className="col-md">
          <div className="card mb-3 mb-md-0">
            <h4 className="card-header">All Compilations</h4>
            <div className="card-body">
              {allCompilations.map((compilation) => (
                <CompilationLinkRow compilation={compilation} key={compilation.id} />
              ))}
            </div>
          </div>
        </div>
        <div className="col-md">
          <div className="card mb-3">
            <h4 className="card-header">Popular Compilations</h4>
            <div className="card-body">
              {popularCompilations.map((compilation) => (
                <CompilationLinkRow compilation={compilation} key={compilation.id} />
              ))}
            </div>
          </div>

          <div className="card">
            <h4 className="card-header">Recently Added/Updated Compilations</h4>
            <div className="card-body">
              {recentCompilations.map((compilation) => (
                <CompilationLinkRow compilation={compilation} key={compilation.id} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
