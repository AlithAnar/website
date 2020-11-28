import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { Minarets } from '../../../api/minarets';
import type { User } from '../../../api/minarets/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await getSession({ req });
  let body: string;

  res.status(200);
  res.setHeader('Content-Type', 'application/json');

  if (session) {
    const api = new Minarets((session.user as User).token);

    const { query } = req;
    const [action] = query.minarets;
    switch (action) {
      case 'getMyPlaylists': {
        const playlists = await api.playlists.listMyPlaylists();

        body = JSON.stringify(playlists);
        break;
      }
      default:
        res.status(404);
        body = JSON.stringify({
          ok: false,
          message: 'Invalid api method',
        });
        break;
    }
  } else {
    res.status(401);
    body = JSON.stringify({
      ok: false,
      message: 'Unauthorized',
    });
  }

  res.end(body);
}