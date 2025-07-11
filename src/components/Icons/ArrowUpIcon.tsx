const ArrowUpIcon = ({
  className = "",
  size = "24",
  color = "currentColor",
  width = "15",
  height = "15",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={size || width}
    height={size || height}
    viewBox="0 0 15 15"
    version="1.1"
    className={`inline-block ${className}`}
    {...props}
  >
    <g id="surface1">
      <path
        style={{
          stroke: "none",
          fillRule: "nonzero",
          fill: "rgb(100%,41.568628%,25.490198%)",
          fillOpacity: 1,
        }}
        d="M 7.507812 0.0351562 C 11.644531 0.0351562 15 3.378906 15 7.503906 C 15 11.628906 11.644531 14.972656 7.507812 14.972656 C 3.375 14.972656 0.0195312 11.628906 0.0195312 7.503906 C 0.0195312 3.378906 3.375 0.0351562 7.507812 0.0351562 Z M 7.507812 0.0351562 "
      />
      <path
        style={{
          fill: "none",
          strokeWidth: "21.3333",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          stroke: "rgb(100%,100%,100%)",
          strokeOpacity: 1,
          strokeMiterlimit: 10,
        }}
        d="M 81.709896 229.21875 L 179.873958 131.0625 M 179.59349 131.0625 L 277.664062 229.21875 "
        transform="matrix(0.0417827,0,0,0.0416667,0,0)"
      />
    </g>
  </svg>
);

export default ArrowUpIcon;
