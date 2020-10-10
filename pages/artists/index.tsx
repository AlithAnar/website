import * as React from 'react';
import { ReactElement } from 'react';
import { GetStaticPropsResult } from 'next';
import { Artists } from '../../api/minarets';
import { Artist } from '../../api/minarets/types/Artist';
import Layout from '../../components/Layout';
import ArtistWithConcertCountLinkRow from '../../components/ArtistWithConcertCountLinkRow';

interface IProps {
  allArtists: Artist[];
  popularArtists: Artist[];
}

export async function getStaticProps(): Promise<GetStaticPropsResult<IProps>> {
  const artistsApi = new Artists();
  const [
    allArtistResults, //
    popularArtistResults,
  ] = await Promise.all([
    artistsApi.listArtists({
      sortAsc: 'Name',
      itemsPerPage: 10,
    }),
    artistsApi.listArtists({
      sortDesc: 'ConcertCount',
      itemsPerPage: 10,
    }),
  ]);

  return {
    props: {
      allArtists: allArtistResults.items,
      popularArtists: popularArtistResults.items,
    },
    // Re-generate the data at most every 24 hours
    revalidate: 86400,
  };
}

export default function Page({ allArtists, popularArtists }: IProps): ReactElement {
  return (
    <Layout title="Artists">
      <section>
        <div className="row">
          <div className="col-md">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">All Artists</h2>
              </div>
              <div className="card-body">
                {allArtists.map((artist) => (
                  <ArtistWithConcertCountLinkRow artist={artist} key={artist.id} />
                ))}
              </div>
            </div>
          </div>
          <div className="col-md">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Popular Artists</h2>
              </div>
              <div className="card-body">
                {popularArtists.map((artist) => (
                  <ArtistWithConcertCountLinkRow artist={artist} key={artist.id} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
