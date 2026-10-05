import { getImage } from 'astro:assets';
import tree from '../assets/willow-mark.jpg';

// Content-hashed build assets inherit the /_astro/ immutable cache policy.
export async function getBrandImages() {
  const [logo, logo2x, small, large] = await Promise.all(
    [46, 92, 220, 440].map(width => getImage({ src: tree, width, format: 'webp', quality: 75 })),
  );
  return {
    logo: logo.src,
    logoSrcset: `${logo.src} 46w, ${logo2x.src} 92w`,
    art: large.src,
    artSrcset: `${small.src} 220w, ${large.src} 440w`,
    artSizes: '(max-width: 480px) 210px, 285px',
  };
}
