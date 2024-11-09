import {
  Attribute,
  AttributeData,
  AttributeType,
  Character,
  Chart,
  ContextualItem,
  useAttributes,
  useCharacter,
  useCharts,
} from '@/libs/compass-api';
import { buildContextualItems } from '@/libs/compass-api/utils/build-items';

interface useOverrideContentProps {
  characterId?: string;
  characterCacheOnly?: boolean;
  archetypeId?: string;
  streamedCharacter?: Character;
  attributesOverride?: Attribute[];
  chartsOverride?: Chart[];
}

export const useOverrideContent = ({
  characterId,
  characterCacheOnly,
  streamedCharacter,
  attributesOverride,
  chartsOverride,
}: useOverrideContentProps) => {
  const { character: _character, loading: overrideLoading } = useCharacter(characterId, {
    cacheOnly: characterCacheOnly,
  });

  const character = (_character ?? streamedCharacter) as Character;

  const { attributes: fetchedAttributes, loading: attributesLoading } = useAttributes(
    Boolean(attributesOverride),
    undefined,
    !attributesOverride, // fetch logic if attributes are not provided
  );

  const rulesetAttributes = (attributesOverride ?? fetchedAttributes) as Attribute[];

  const { attributes: rulesetItems, loading: itemsLoading } = useAttributes(
    !!streamedCharacter,
    AttributeType.ITEM,
    true,
  );

  const { charts: fetchedCharts } = useCharts(undefined, Boolean(chartsOverride));
  const charts = (chartsOverride ?? fetchedCharts) as Chart[];

  const characterItemData = Boolean(character?.itemData)
    ? (JSON.parse(character.itemData) as ContextualItem[])
    : buildContextualItems(rulesetItems);

  const characterAttributeData = JSON.parse(character?.attributeData ?? '[]') as AttributeData[];

  const characterAttributesWithoutDeadAttributes = characterAttributeData.filter((charAttr) =>
    rulesetAttributes.some((attr) => attr.id === charAttr.id),
  );

  return {
    character,
    characterId,
    rulesetAttributes,
    rulesetItems,
    characterAttributeData: characterAttributesWithoutDeadAttributes,
    characterItemData,
    charts,
    loading: overrideLoading || attributesLoading || itemsLoading,
  };
};
