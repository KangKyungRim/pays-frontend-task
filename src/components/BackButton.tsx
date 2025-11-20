import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

interface BackButtonProps {
  text?: string; 
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  text = "",
  className = "",
}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${className}`}
    >
      <ArrowLeftIcon className="w-5 h-5" />
      {text}
    </button>
  );
};

export default BackButton;