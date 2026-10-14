export interface AvatarInputProps {
  src: string | null;
  onChange: (file: File) => void;
  size?: 's' | 'm' | 'l' | 'form';
  error?: string;
  className?: string;
}