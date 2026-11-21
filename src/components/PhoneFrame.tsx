import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';

const FRAME_WIDTH = 414;
const FRAME_HEIGHT = 868;
const PAGE_MARGIN = 24;

function getFrameScale() {
  const heightRatio = (window.innerHeight - PAGE_MARGIN) / FRAME_HEIGHT;
  const widthRatio = (window.innerWidth - PAGE_MARGIN) / FRAME_WIDTH;
  return Math.min(1, heightRatio, widthRatio);
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(getFrameScale);

  useEffect(() => {
    const updateScale = () => setScale(getFrameScale());
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div className="phone-stage">
      <div className="phone-frame" style={{ '--frame-scale': scale } as CSSProperties}>
        <div className="phone-screen">
          <div className="phone-notch" aria-hidden="true" />
          {children}
          <div className="phone-home-bar" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
