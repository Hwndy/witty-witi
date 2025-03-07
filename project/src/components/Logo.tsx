import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-12' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <div className="text-3xl font-extrabold">
          <span className="text-secondary">W</span>
          <span className="text-primary">ITTY WITI</span>
        </div>
        <div className="text-xs uppercase tracking-widest text-secondary font-semibold">
          M E R C H A N D I S E
        </div>
      </div>
    </div>
  );
};

export default Logo;