
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="mx-auto mb-4 flex items-center justify-center">
      <img 
        src="/images/Logo.jpeg" 
        alt="Restaurante Logo" 
        className="w-24 h-24 md:w-28 md:h-28 object-contain" 
      />
    </div>
  );
};

export default Logo;
