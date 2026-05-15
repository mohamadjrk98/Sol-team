import Image from 'next/image';
import { UserRound } from 'lucide-react';

export default function Avatar({ src, name, size = 118 }: { src?: string | null; name: string; size?: number }) {
  if (src) return <Image className="avatar" src={src} alt={name} width={size} height={size} />;
  return <div className="avatar" style={{ width: size, height: size }} aria-label={name}><UserRound size={Math.round(size/2)} /></div>;
}
