const BurgerButton = ({ 
  className = "",
  size = "24",
  width = "32",
  height = "22",
  ...props 
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || width}
    height={size || height}
    viewBox="0 0 31 22"
    version="1.1"
    className={`inline-block ${className}`}
    {...props}
  >
    <g id="surface1">
      <path
        style={{
          fill: "none",
          strokeWidth: "13.3333",
          strokeLinecap: "round",
          strokeLinejoin: "miter",
          stroke: "white",
          strokeOpacity: 1,
          strokeMiterlimit: 10,
        }}
        d="M 7.609627 7.023438 L 157.66066 7.023438 M 7.609627 58.102983 L 157.66066 58.102983 M 7.609627 109.203125 L 157.66066 109.203125"
        transform="matrix(0.187879,0,0,0.189655,0,0)"
      />
    </g>
  </svg>
);

export default BurgerButton;