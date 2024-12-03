import { useState } from 'react';

export function useLocalStorage<T>(initialValue: T) {
    const [storedValue, setStoredValue] = useState(initialValue);

    const getValue = (key: string) => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    };

    const setValue = (key: string, value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return { storedValue, getValue, setValue };
}