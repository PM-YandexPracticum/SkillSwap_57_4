export type AvatarSize = 's' | 'm' | 'l';

export interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: AvatarSize;
  className?: string;
}
