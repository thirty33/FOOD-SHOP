// Componente ToggleIcon (interruptor/pill)
const ToggleIcon = ({ 
  className = "",
  size = "24",
  color = "#286C39",
  width = "30",
  height = "16",
  ...props 
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || width}
    height={size || height}
    viewBox="0 0 30 16"
    fill="none"
    className={`inline-block ${className}`}
    {...props}
  >
    <path
      d="M21.8672 0.713623H7.80469C3.47135 0.713623 0.367188 3.92196 0.367188 8.17196C0.367188 12.4011 3.47135 15.6095 7.80469 15.6095H21.8672C26.2005 15.6095 29.3047 12.4011 29.3047 8.17196C29.3047 3.92196 26.2005 0.713623 21.8672 0.713623Z"
      fill={color}
    />
  </svg>
);

// Componente PlusIcon (símbolo de suma/agregar)
const PlusIcon = ({ 
  className = "",
  size = "24",
  color = "#286C39",
  width = "55",
  height = "53",
  ...props 
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || width}
    height={size || height}
    viewBox="0 0 55 53"
    fill="none"
    className={`inline-block ${className}`}
    {...props}
  >
    <path
      d="M27.7376 52.2135C32.5918 52.2135 36.1126 48.5885 36.1126 43.7343V34.3385H46.446C51.7168 34.3385 54.4043 30.2968 54.4043 26.3802C54.4043 22.3385 51.7168 18.4218 46.446 18.4218H36.1126V9.00517C36.1126 4.151 32.5918 0.526001 27.7376 0.526001C22.8835 0.526001 19.3626 4.151 19.3626 9.00517V18.4218H8.92513C3.6543 18.4218 0.966797 22.3385 0.966797 26.3802C0.966797 30.2968 3.6543 34.3385 8.92513 34.3385H19.3626V43.7343C19.3626 48.5885 22.8835 52.2135 27.7376 52.2135Z"
      fill={color}
    />
  </svg>
);

// Exportar ambos componentes
export { ToggleIcon, PlusIcon };