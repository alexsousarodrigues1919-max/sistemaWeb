
import React, { useState } from 'react';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  onAction: () => Promise<void>;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ 
  isLoading: externalLoading, 
  onAction, 
  children, 
  variant = 'primary',
  className = '',
  ...props 
}) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (loading || props.disabled) return;

    setLoading(true);
    setProgress(0);

    // Intervalo mais rápido para uma sensação de sistema mais responsivo
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 98) return prev;
        return prev + Math.floor(Math.random() * 25);
      });
    }, 80);

    try {
      await onAction();
      setProgress(100);
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
    }
  };

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 disabled:bg-slate-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600'
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`relative overflow-hidden px-6 py-2.5 rounded-xl font-black transition-all duration-200 active:scale-95 flex items-center justify-center min-w-[120px] shadow-sm ${variants[variant]} ${className}`}
    >
      <span className={loading ? 'opacity-0' : 'opacity-100'}>{children}</span>
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <div className="flex flex-col items-center">
            <span className="text-xs font-black">{progress}%</span>
            <div className="w-24 h-1.5 bg-white/30 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </button>
  );
};

export default LoadingButton;
