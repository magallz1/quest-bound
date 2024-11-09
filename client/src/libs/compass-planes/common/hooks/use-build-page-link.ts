import { useCharacter } from '@/libs/compass-api';
import { useParams } from 'react-router-dom';

/**
 * Builds the appropriate client side link for a rulebook or journal page given the current context.
 */
export const useBuildPageLink = (pageId?: string | null): string | null => {
  const { rulesetId, characterId } = useParams();

  const { character } = useCharacter(characterId);

  if (!pageId) return null;

  if (pageId.includes('http')) return pageId;

  const isJournalPage =
    !!character &&
    !character.id.includes('cache-only') &&
    character.pages.some((p) => p.id === pageId);

  let pageLink = `/rulesets/${rulesetId}/rulebook?page=${pageId}`;

  if (isJournalPage) {
    pageLink = `/rulesets/${rulesetId}/characters/${characterId}/journal?page=${pageId}`;
  } else if (!!character && !character.id.includes('cache-only')) {
    pageLink = `/rulesets/${rulesetId}/characters/${characterId}/rulebook?page=${pageId}`;
  }

  return pageLink;
};
