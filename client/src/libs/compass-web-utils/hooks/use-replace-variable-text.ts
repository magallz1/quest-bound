import { ArchetypeContext, Attribute, ContextualAttribute, useCharacter } from '@/libs/compass-api';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { emitter } from '../utils/event-emitter';

const attributeDescriptors = [
  {
    key: 'max',
    value: 'maxValue',
  },
  {
    key: 'min',
    value: 'minValue',
  },
  {
    key: 'description',
    value: 'description',
  },
];

export type Replacement = {
  target: string;
  replacement: string;
};

/**
 * Will replace properties within {{ }} with values from its context.
 *
 * Attribute names will be replaced with their default values. {{name}} will be replaced with the character's name if there's character context, or the
 * archetype title if an archetype has been assigned to a page.
 */
export const useReplaceVariableText = (
  text: string,
  attributes: ContextualAttribute[],
  announcementId?: string | null,
) => {
  const { characterId } = useParams();
  const { character } = useCharacter(characterId);

  const archetypeContext = useContext(ArchetypeContext);
  const overrideMap = archetypeContext?.archetypeOverrideMap ?? new Map();

  const injectedName = archetypeContext?.archetype?.title ?? character?.name ?? '{{name}}';

  const [announcementText, setAnnouncementText] = useState<string | null>(null);

  useEffect(() => {
    emitter.on(`announcement:${announcementId}`, (msg: string) => {
      setAnnouncementText(msg);
    });
  }, [announcementId]);

  const normalizedAttributes = attributes.map((attr) => {
    const attributeValue = overrideMap.get(attr.id) ?? `${attr.value}`;

    return {
      target: attr.name.toLowerCase(),
      replacement: attributeValue,
    };
  });

  const replacements = [
    {
      target: 'name',
      replacement: injectedName,
    },
    ...normalizedAttributes,
  ];

  if (announcementText) {
    replacements.push({
      target: 'announcement',
      replacement: announcementText,
    });
  }

  for (const attribute of attributes) {
    for (const { key, value } of attributeDescriptors) {
      const attrProp = attribute[value as keyof typeof attribute];
      if (!attrProp) continue;
      replacements.push({
        target: `${attribute.name.toLowerCase()}:${key}`,
        replacement: `${attrProp}`,
      });
    }
  }

  const injectedText = replaceTextWithinBrackets(text, replacements);

  return injectedText;
};

export function replaceTextWithinBracketsWithAttributes(
  _text: string | number | undefined,
  attributes: ContextualAttribute[] | Attribute[],
) {
  const text = _text ? `${_text}` : '';
  const replacements: Replacement[] = [];

  for (const attribute of attributes) {
    replacements.push({
      target: `${attribute.name.toLowerCase()}`,
      replacement: `${(attribute as ContextualAttribute).value}`,
    });
  }

  return replaceTextWithinBrackets(text, replacements);
}

export function replaceTextWithinBrackets(
  inputString: string,
  replacements: Replacement[],
): string {
  let result = inputString;

  for (const { target, replacement } of replacements) {
    const regex = new RegExp(`{{${target}}}`, 'ig');
    result = result.replace(regex, replacement);
  }

  return result;
}
