import NodeCache from 'node-cache';

let cache: NodeCache | null = null;

export const getCache = () => {
  if (!cache) {
    cache = new NodeCache();
  }
  return cache;
};
