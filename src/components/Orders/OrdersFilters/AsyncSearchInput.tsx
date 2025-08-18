import { useCallback, useState } from "react";
import debounce from "just-debounce-it";

interface AsyncSearchInputProps {
  placeholder?: string;
  onSearch: (searchTerm: string) => void;
  debounceDelay?: number;
  className?: string;
  name?: string;
}

export const AsyncSearchInput = ({
  placeholder = "Buscar...",
  onSearch,
  debounceDelay = 500,
  className = "",
  name = "search"
}: AsyncSearchInputProps) => {
  const [inputValue, setInputValue] = useState("");

  // Crear función debounced que emite el evento al componente padre
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      onSearch(searchTerm);
    }, debounceDelay),
    [onSearch, debounceDelay]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    
    // Llamar a la función debounced
    debouncedSearch(value);
  };

  return (
    <input
      type="text"
      name={name}
      value={inputValue}
      placeholder={placeholder}
      onChange={handleInputChange}
      className={className}
    />
  );
};