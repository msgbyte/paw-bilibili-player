// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import got from 'got';
import { fromBase64 } from '../../../utils/base64';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = fromBase64(req.query?.url.toString());
  const origin = fromBase64(req.query?.origin.toString());

  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${60 * 60}, stale-while-revalidate=${60 * 60}`
  );
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'video/x-flv');
  got
    .stream(url, {
      headers: {
        Accept: 'application/json',
        Referer: origin,
        Origin: origin,
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:56.0) Gecko/20100101 Firefox/56.0',
      },
    })
    .on('downloadProgress', (progress) => {
      console.log('progress', progress);
    })
    .on('error', (error) => {
      console.error('error', error);
    })
    .pipe(res);
}
