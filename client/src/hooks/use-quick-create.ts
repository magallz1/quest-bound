import { useSearchParams } from 'react-router-dom';

export const useQuickCreate = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setQuickCreatePage = (page: string, others?: Record<string, string>) => {
    searchParams.set('quick-create', page);
    if (others) {
      Object.entries(others).forEach(([key, value]) => {
        searchParams.set(key, value);
      });
    }
    setSearchParams(searchParams);
  };

  return { setQuickCreatePage };
};
