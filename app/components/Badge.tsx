import React from 'react';

interface BadgeProps {
  count: number;
}

const Badge: React.FC<BadgeProps> = ({ count }) => (
  <span className="bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
    {count}
  </span>
);

export default Badge;
