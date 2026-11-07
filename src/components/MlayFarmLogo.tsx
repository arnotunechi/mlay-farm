import React from 'react';

interface MlayFarmLogoProps {
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const MlayFarmLogo: React.FC<MlayFarmLogoProps> = ({
  className = '',
  showSubtitle = true,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8 text-base',
    md: 'w-11 h-11 text-xl',
    lg: 'w-16 h-16 text-3xl',
  };

  const titleSizes = {
    sm: 'text-base font-extrabold tracking-tight leading-none',
    md: 'text-xl font-black tracking-tight leading-none',
    lg: 'text-3xl font-black tracking-tight leading-none',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Emblem Badge */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-amber-700 text-white shadow-md shadow-emerald-900/20 ring-2 ring-emerald-500/30 flex-shrink-0 overflow-hidden`}
      >
        {/* Subtle decorative background circles */}
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400/20 blur-xs" />
        <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-emerald-400/20 blur-xs" />

        {/* Chicken / Broiler Silhouette Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-3/5 h-3/5 drop-shadow-sm text-amber-200"
        >
          {/* Stylized healthy broiler chicken */}
          <path d="M12.5 3C11.5 3 10.8 3.5 10.3 4.2C9.5 4 8.7 4.2 8.1 4.7C7.4 5.3 7 6.1 7 7C6 7.2 5.2 8 5 9C4.8 9.9 5.2 10.8 6 11.3C5.5 12.3 5.5 13.5 6 14.5C6.7 15.8 8.1 16.7 9.6 16.9L9 19.5H7.5V21H11.5V19.5H10.6L11.1 17H13.5L14 19.5H13V21H17V19.5H15.5L14.9 17C17.5 16.7 19.5 14.5 19.5 12C19.5 10 18.2 8.3 16.4 7.5C16.8 6.5 16.5 5.3 15.6 4.5C14.7 3.6 13.5 3.3 12.5 3ZM11 7C11.6 7 12 7.4 12 8C12 8.6 11.6 9 11 9C10.4 9 10 8.6 10 8C10 7.4 10.4 7 11 7Z" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`${titleSizes[size]} text-slate-900 tracking-wider font-['Plus_Jakarta_Sans',sans-serif]`}>
            MLAY <span className="text-emerald-700">FARM</span>
          </span>
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 uppercase tracking-wider border border-emerald-200">
            Meat Poultry
          </span>
        </div>
        {showSubtitle && (
          <p className="text-[11px] font-medium text-slate-500 tracking-normal mt-0.5">
            Broiler & Meat Chicken Management
          </p>
        )}
      </div>
    </div>
  );
};
