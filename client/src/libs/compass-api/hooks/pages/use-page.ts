import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { page, Page, PageQuery, PageQueryVariables } from '../../gql';
import { useLazyQuery, useQuery } from '../../utils';
import { useComponents } from '../components';
import { useError } from '../metrics';
import { useGetSheet } from '../sheets';
import { usePages } from './use-pages';

export const usePage = (id?: string) => {
  const { rulesetId } = useParams();
  const { pages } = usePages();
  const { getSheet } = useGetSheet();
  const { getComponents } = useComponents();

  const cachingPages = useRef<boolean>(false);

  const { data, loading, error } = useQuery<PageQuery, PageQueryVariables>(page, {
    variables: {
      input: {
        id: id ?? '',
        rulesetId: rulesetId ?? '',
      },
    },
    skip: !id || !rulesetId,
  });

  const [lazy] = useLazyQuery<PageQuery, PageQueryVariables>(page);

  useError({
    error,
    message: 'Failed to load page',
  });

  // Precache the pages before and after fetched page for faster rulebook navigation
  const precacheNearestPages = async () => {
    if (!rulesetId) return;
    const page = data?.page;
    if (!page) return;

    const nearestPages: Page[] = pages.filter(
      (p) => p.sortIndex === page.sortIndex - 1 || p.sortIndex === page.sortIndex + 1,
    );

    for (const page of nearestPages) {
      await Promise.all([
        lazy({ variables: { input: { id: page.id, rulesetId } } }),
        getSheet(page.sheetId),
        getComponents(page.sheetId),
      ]);
    }

    cachingPages.current = true;
  };

  useEffect(() => {
    if (cachingPages.current) return;
    precacheNearestPages();
    cachingPages.current = true;
  }, [id]);

  const getPage = async (id: string) => {
    if (!rulesetId) return;
    const res = await lazy({
      variables: {
        input: {
          id,
          rulesetId,
        },
      },
    });

    if (!res.data?.page) {
      throw Error('Failed to load page');
    }

    return res.data.page as Page;
  };

  return {
    page: (data?.page as Page) ?? null,
    getPage,
    loading,
    error,
  };
};
