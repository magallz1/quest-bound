import { useEffect, useRef, useState } from 'react';
import { editorEmitter } from '../utils';

export const useSubscribeComponentChanges = (id: string | null) => {
  const [key, setKey] = useState(0);
  const subscribed = useRef(false);

  useEffect(() => {
    if (subscribed.current || !id) return;
    editorEmitter.on(`component-${id}-update`, () => {
      setKey((prev) => prev + 1);
    });
    subscribed.current = true;
  }, [id]);

  return `component-${id}-key-${key}`;
};
