type BrandMarkProps = {
  className?: string;
  textClassName?: string;
  showTagline?: boolean;
};

export default function BrandMark({
  className = "",
  textClassName = "",
  showTagline = false,
}: BrandMarkProps) {
  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl border-3 border-black bg-gradient-to-br from-yellow-300 via-yellow-400 to-green-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-7 w-7 sm:h-8 sm:w-8"
        >
          <circle cx="12" cy="12" r="9" fill="#1f7a3f" />
          <path
            d="M5.5 12c1.6-2.7 4.3-4.5 7.4-4.9-.4 1.7-.7 3.1-.9 4.3 1.7.2 3.4 0 5.1-.7-.9 2-2.4 3.5-4.4 4.4-.3 1.4-.6 2.8-.8 4.2-3.2-.5-5.8-2.4-6.4-7.3Z"
            fill="#a7f3d0"
            opacity="0.95"
          />
          <path
            d="M9.2 6.8c.8.2 1.8.8 2.4 1.7M15.9 8.5c-1 .7-1.8 1.4-2.2 2.2M8.7 15.3c1-.2 1.8-.7 2.5-1.4M14.4 14.2c.7.4 1.4.9 2 1.7"
            stroke="#166534"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
      <div className="leading-tight">
        <div
          className={`text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold tracking-wide text-transparent bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text ${textClassName}`}
          style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
        >
          EDU EARTH
        </div>
        {showTagline && (
          <div className="text-[8px] sm:text-[10px] text-green-300 font-sans hidden sm:block">
            🌍 Save the Planet
          </div>
        )}
      </div>
    </div>
  );
}
