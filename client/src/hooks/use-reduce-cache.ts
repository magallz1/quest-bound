import { attributesWithLogic } from '@/libs/compass-api';
import { cache } from '@/libs/compass-api/cache';
import { useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const routesThatUseLogic = ['sheet-template', 'character'];

/**
 * Reduces the cache size by evicting resources when they aren't needed.
 */
export const useReduceCache = () => {
  const { pathname } = useLocation();
  const { rulesetId } = useParams();

  const logicIsCached = useRef<boolean>(false);

  useEffect(() => {
    if (routesThatUseLogic.some((route) => pathname.includes(route))) {
      logicIsCached.current = true;
    } else if (pathname === '/') {
      // Clear entire ruleset when navigating to the home page
      cache.reset();
    } else if (logicIsCached.current) {
      const cachedAttributes: any = cache.readQuery({
        query: attributesWithLogic,
        variables: { rulesetId },
      });

      // Remove the logic of all attributes from the cache when it isn't needed
      for (const attribute of cachedAttributes?.attributes ?? []) {
        const id = cache.identify({
          id: attribute.id,
          rulesetId,
          __typename: 'Attribute',
        });

        cache.evict({ id, fieldName: 'logic' });
      }

      cache.gc();

      logicIsCached.current = false;
    }
  }, [pathname]);
};
