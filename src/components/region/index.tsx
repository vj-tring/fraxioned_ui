import React from 'react';

interface RegionProps {
  label: string;
  date: Date | string | undefined;
  onClick: () => void;
  isActive: boolean;
}

const Region: React.FC<RegionProps> = ({ label, date, onClick, isActive }) => {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Add Dates";
    if (date instanceof Date) {
      return date.toLocaleDateString('en-US', dateOptions);
    }
    if (typeof date === 'string') {
      return date;
    }
    return "Invalid Date";
  };

  return (
    <div 
      className={`d-flex align-items-start flex-column cursor-pointer ${isActive ? 'active1' : ''}`}
      onClick={onClick}
    >
      <span className="DateHead1 monsterrat">{label}</span>
      <p className="property1 monsterrat">
        {formatDate(date)}
      </p>
    </div>
  );
};

export default Region;