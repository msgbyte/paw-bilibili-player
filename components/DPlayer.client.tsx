import type { DPlayerOptions } from 'dplayer';
import { useEffect, useRef } from 'react';

const DPlayer: React.FC<{
  url: string;
  pic?: string;
  style?: React.CSSProperties;
}> = ({ url, pic, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      import('flv.js'),
      import('dplayer').then((m) => m.default),
    ]).then(([flvjs, Dplayer]) => {
      (window as any).flvjs = flvjs;

      const options: DPlayerOptions = {
        container: containerRef.current,
        video: {
          url: url,
          type: 'flv',
          pic,
          thumbnails: pic,
        },
        contextmenu: [
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
    });
  }, []);

  return <div ref={containerRef} style={style} />;
};

export default DPlayer;
