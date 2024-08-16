interface RegionProps {
  label: string;
  date: Date | undefined;
  onClick: () => void;
  isActive: boolean;
}

const Region: React.FC<RegionProps> = ({ label, date, onClick, isActive }) => {
  return (
    <div 
      className={`d-flex align-items-start flex-column cursor-pointer ${isActive ? 'active1' : ''}`}
      onClick={onClick}
    >
      <span className="DateHead1 monsterrat">{label}</span>
      <p className="property1 monsterrat">
        {date ? date.toLocaleDateString() : "Add Dates"}
      </p>
    </div>
  );
};

export default Region;