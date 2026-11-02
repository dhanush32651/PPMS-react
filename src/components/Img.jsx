import { PLACEHOLDER } from '../data/seed';

// Image that falls back to a branded placeholder if the URL cannot load
export default function Img({ src, alt = '', ...rest }) {
  return (
    <img
      src={src || PLACEHOLDER}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER;
      }}
      {...rest}
    />
  );
}
