import { useCallback, useState, useEffect } from "react";
import debounce from "just-debounce-it";

interface AsyncSearchInputProps {
  placeholder?: string;
  onSearch: (searchTerm: string) => void;
  debounceDelay?: number;
  className?: string;
  name?: string;
  value?: string;
}

export const AsyncSearchInput = ({
  placeholder = "Buscar...",
  onSearch,
  debounceDelay = 500,
  className = "",
  name = "search",
  value: externalValue
}: AsyncSearchInputProps) => {
  const [inputValue, setInputValue] = useState(externalValue ?? "");

  // Sync internal state with external value when it changes
  useEffect(() => {
    if (externalValue !== undefined) {
      setInputValue(externalValue);
    }
  }, [externalValue]);

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