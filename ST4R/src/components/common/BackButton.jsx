import { useNavigate } from 'react-router-dom';
import WestIcon from '../../assets/icons/west.svg?react';

export default function BackButton({ className = '', onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-3 bg-[#1D1D1D] rounded-full hover:bg-[#2A2A2A] transition-colors ${className}`}
    >
      <WestIcon className="w-6 h-6" style={{ color: '#8F8F8F' }} />
    </button>
  );
}

