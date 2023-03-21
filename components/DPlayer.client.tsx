import type { DPlayerOptions } from 'dplayer';
import { useEffect, useRef } from 'react';
import { toBase64 } from '../utils/base64';
import { saveAs } from 'file-saver';

const DPlayer: React.FC<{
  pageUrl: string;
  videoUrl: string;
  picUrl: string;
  style?: React.CSSProperties;
}> = ({ pageUrl, videoUrl, picUrl, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoProxyUrl = `/api/proxy/video?url=${toBase64(
    videoUrl
  )}&origin=${toBase64(pageUrl)}`;
  const picProxyUrl = picUrl
    ? `/api/proxy/video?url=${toBase64(picUrl)}&origin=${toBase64(pageUrl)}`
    : undefined;

  useEffect(() => {
    Promise.all([import('dplayer').then((m) => m.default)]).then(
      ([Dplayer]) => {
        const options: DPlayerOptions = {
          container: containerRef.current,
          video: {
            url: videoProxyUrl,
            pic: picProxyUrl,
            thumbnails: picProxyUrl,
          },
          contextmenu: [
            {
              text: '打开原视频',
              click: () => {
                window.open(pageUrl);
              },
            },
            {
              text: '下载封面',
              click: () => {
                saveAs(picProxyUrl ?? picUrl, 'cover.png');
              },
            },
            {
              text: '下载原视频',
              click: () => {
                saveAs(videoUrl, 'video.flv');
              },
            },
            {
              text: '关于 paw-bilibili-player',
              link: 'https://github.com/msgbyte/paw-bilibili-player',
            },
          ],
          autoplay: false,
          screenshot: true,
          preload: 'none',
          logo: '/logo.png',
        };
        const player = new Dplayer(options);
        player.fullScreen.request('web');
        // this.dp = player;
        console.log(player);
      }
    );
  }, []);

  return <div ref={containerRef} style={style} />;
};

export default DPlayer;
