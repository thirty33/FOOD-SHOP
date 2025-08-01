interface DeleteIconProps {
  width?: string;
  height?: string;
  size?: string;
  color?: string;
  strokeWidth?: string;
  className?: string;
  onClick?: () => void;
}

const DeleteIcon = ({
  width = "24",
  height = "24",
  size,
  color = "#FF6A41",
  strokeWidth = "2",
  className = "",
  onClick,
}: DeleteIconProps) => {
  const iconSize = size || width;
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={iconSize}
      height={size || height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-x-icon lucide-x ${className}`}
      onClick={onClick}
    >
      <path d="M18 6 6 18"/>
      <path d="m6 6 12 12"/>
    </svg>
  );
};

export default DeleteIcon;