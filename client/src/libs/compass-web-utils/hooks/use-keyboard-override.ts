import { useEffect } from 'react';

export const useKeyboardOverride = (key: string, callback: () => void) => {
  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === key) {
        e.preventDefault();
        e.stopImmediatePropagation();
        callback();
      }
    };

    document.addEventListener('keydown', handleEnter);
    return () => document.removeEventListener('keydown', handleEnter);
  }, []);
};
