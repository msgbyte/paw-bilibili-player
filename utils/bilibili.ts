import md5 from 'md5';
import got from 'got';
import _ from 'lodash';

const APP_KEY = 'iVGUTjsxvpLeuDCf';
const BILIBILI_KEY = 'aHRmhWMLkdeMuILqORnYZocwMBpMEOdt';

/**
 * 获取Bilibili视频 url
 *
 * @link https://github.com/ytdl-org/youtube-dl/blob/master/youtube_dl/extractor/bilibili.py
 */
export async function getBilibiliVideoUrl(
  url: string
): Promise<{ url: string } | undefined> {
  if (url.includes('anime/')) {
    // 暂不支持 anime
    return undefined;
  }

  const webpage = await got.get(url).text();
  const groups = /"cids":{"1":(\d*?)}/.exec(webpage);
  const cid = _.get(groups, '1');
  if (!cid) {
    return undefined;
  }

  const rendition = 'qn=80&quality=80&type=';
  const payload = `appkey=${APP_KEY}&cid=${cid}&otype=json&${rendition}`;
  const sign = md5(payload + BILIBILI_KEY);

  const playurlRes = await got
    .get(`http://interface.bilibili.com/v2/playurl?${payload}&sign=${sign}`, {
      headers: {
        Accept: 'application/json',
        Referer: url,
      },
    })
    .json();

  return {
    url: _.get(playurlRes, 'durl.0.url'),
  };
}
