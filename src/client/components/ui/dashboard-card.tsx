// DashboardCard.tsx (or wherever your DashboardCard is located)
interface DashboardCardProps {
  title: string;
  description: string;
  onClick?: () => void; // Make onClick optional
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <h2 className="font-secondary font-semibold">{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default DashboardCard;
