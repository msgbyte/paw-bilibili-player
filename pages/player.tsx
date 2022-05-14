import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { toBase64 } from '../utils/base64';
import { getBilibiliVideoUrl } from '../utils/bilibili';
import DPlayer from '../components/DPlayer.client';

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<
  GetServerSidePropsResult<{
    pageUrl: string;
    videoUrl: string;
    picUrl: string;
  }>
> => {
  const url = context.query.url?.toString();
  if (!url) {
    return { notFound: true };
  }

  if (!url.startsWith('https://www.bilibili.com/video/BV')) {
    return { notFound: true };
  }

  const info = await getBilibiliVideoUrl(url);
  if (!info) {
    return { notFound: true };
  }

  const videoUrl = info.url;
  const picUrl = info.thumbnail;

  context.res.setHeader(
    'Cache-Control',
    `public, s-maxage=${1 * 24 * 60 * 60}, stale-while-revalidate=${
      3 * 24 * 60 * 60
    }`
  );

  return {
    props: {
      pageUrl: url,
      videoUrl,
      picUrl,
    },
  };
};

const Player: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ pageUrl, videoUrl, picUrl }) => {
  return (
    <DPlayer
      pageUrl={pageUrl}
      videoUrl={videoUrl}
      picUrl={picUrl}
      style={{ width: '100%', height: '100%' }}
    />
  );

  // return (
  //   <div>
  //     <h2>原地址: {pageUrl}</h2>
  //     <p>
  //       视频地址:{' '}
  //       <a href={videoUrl} target="_blank" rel="noreferrer">
  //         {videoUrl}
  //       </a>{' '}
  //     </p>
  //     <p>
  //       代理地址:{' '}
  //       <a href={proxyUrl} target="_blank" rel="noreferrer">
  //         {proxyUrl}
  //       </a>
  //     </p>

  //     <DPlayer url={proxyUrl} />
  //   </div>
  // );
};
Player.displayName = 'Player';

export default Player;
