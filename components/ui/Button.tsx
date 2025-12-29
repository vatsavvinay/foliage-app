import { Leaf } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-medium rounded-lg transform-gpu transition-transform duration-150 ease-out inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:-translate-y-1 active:scale-95';

  const variants = {
    primary: 'bg-sage-600 text-white hover:bg-sage-700 focus:ring-sage-500',
    secondary: 'bg-cream-600 text-white hover:bg-cream-700 focus:ring-cream-500',
    outline: 'border border-neutral-300 text-neutral-900 hover:bg-neutral-50 focus:ring-neutral-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
