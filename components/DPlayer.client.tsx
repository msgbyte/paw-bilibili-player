import { useEffect, useRef } from 'react';

const DPlayer: React.FC<{
  url: string;
}> = ({ url }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      import('flv.js'),
      import('dplayer').then((m) => m.default),
    ]).then(([flvjs, Dplayer]) => {
      (window as any).flvjs = flvjs;

      const options = {
        container: containerRef.current,
        video: {
          url: url,
          type: 'flv',
        },
        contextmenu: [
          {
            text: 'qwe',
            link: '',
          },
        ],
        autoplay: true,
        live: true,
        screenshot: true,
        logo: './static/logo.png',
      };
      const player = new Dplayer(options);
      // this.dp = player;
      console.log(player);
    });
  }, []);

  return <div ref={containerRef} />;
};

export default DPlayer;
