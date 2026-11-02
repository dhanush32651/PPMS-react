import { useEffect, useRef } from 'react';
import Img from './Img';

// Image that drifts and tilts slightly in 3D while the page scrolls
export default function Parallax({ src, alt, speed = 0.12, tilt = 4, className = '' }) {
  const wrap = useRef(null);
  const inner = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = wrap.current;
      if (!el || !inner.current) return;
      const r = el.getBoundingClientRect();
      const offset = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight; // -1..1
      inner.current.style.transform = `translate3d(0, ${offset * -speed * 200}px, 0) rotateX(${offset * tilt}deg) scale(1.12)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed, tilt]);
  return (
    <div ref={wrap} className={`parallax ${className}`}>
      <div ref={inner} className="parallax-inner">
        <Img src={src} alt={alt} loading="eager" />
      </div>
    </div>
  );
}
