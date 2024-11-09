import { useMemo } from 'react';
import { useReactFlow } from 'reactflow';

export const useNodeSize = (id?: string) => {
  const reactFlow = useReactFlow();
  const node = reactFlow.getNode(id ?? '');

  const height = useMemo(() => node?.height ?? 0, [node]);
  const width = useMemo(() => node?.width ?? 0, [node]);

  return {
    height: height ? `${height}px` : '',
    width: width ? `${width}px` : '',
  };
};
