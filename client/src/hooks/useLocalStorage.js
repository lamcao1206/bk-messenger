import { useState, useEffect } from 'react';

export function useLocalStorage(key, initValue) {
  const [value, setValue] = useState(function () {
    const localValue = localStorage.getItem(key);
    return localValue ? JSON.parse(localValue) : typeof initValue === 'function' ? initValue() : initValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
