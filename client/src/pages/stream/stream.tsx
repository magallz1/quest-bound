import {
  ComponentTypes,
  ContextualAttribute,
  useStreamCharacter,
  useStreamComponents,
} from '@/libs/compass-api';
import { Loading, LogoIcon, Stack, Text } from '@/libs/compass-core-ui';
import { IOType, Logic, OperationType, ReadOnlySheet } from '@/libs/compass-planes';
import { replaceTextWithinBracketsWithAttributes } from '@/libs/compass-web-utils';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

export const Stream = () => {
  const { characterId } = useParams();
  const { character, loading, subscribeToUpdates } = useStreamCharacter(characterId);

  const attributes = character?.attributes ?? [];

  const subscribed = useRef<boolean>(false);
  const subscribedComponents = useRef<boolean>(false);

  useEffect(() => {
    if (subscribed.current) return;
    subscribeToUpdates();
    subscribed.current = true;
  }, []);

  const { components, subscribeToUpdates: subscribeToComponents } = useStreamComponents({
    sheetId: character?.sheet?.id ?? '',
    rulesetId: character?.rulesetId ?? '',
    tabId: character?.streamTabId ?? '',
  });

  useEffect(() => {
    if (subscribedComponents.current) return;
    subscribeToComponents();
    subscribedComponents.current = true;
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!character || !character.streamTabId) {
    return (
      <main
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <Stack spacing={1} justifyContent='center' alignItems='center'>
          <LogoIcon style={{ height: 200, width: 200 }} />
          <Text variant='h3'>Quest Bound</Text>
        </Stack>
        <Text variant='h4'>Character not streaming</Text>
      </main>
    );
  }

  const characterAttributes = JSON.parse(character.attributeData ?? '[]') as ContextualAttribute[];

  const componentsWithValues = components.map((comp) => {
    const data = JSON.parse(comp.data ?? '{}');
    const attributeId = data.attributeId ?? null;
    const attribute = characterAttributes.find((attr) => attr.id === attributeId);

    const value = attribute?.value ?? data.value;
    const valueWithReplacement = replaceTextWithinBracketsWithAttributes(value, [
      ...characterAttributes,
      { id: 'name', name: 'name', value: character.name } as ContextualAttribute,
    ]);
    const url = data.useEntityImage ? character?.image?.src : comp.images?.[0]?.src;

    const maxAssignedAttribute = characterAttributes.find(
      (attr) => attr.id === data.maxValueAttributeId,
    );

    const correspondingAttribute = attributes.find((attr) => attr.id === data.attributeId);

    const assignedAttributeLogic = (
      correspondingAttribute?.logic ? JSON.parse(correspondingAttribute.logic) : []
    ) as Logic;

    const defaultValueNode = assignedAttributeLogic.find(
      (op) => op.type === OperationType.DefaultValue,
    );
    const maxValueNode = assignedAttributeLogic.find((op) =>
      op.connections.some(
        (c) => c.id === defaultValueNode?.id && c.targetType === ('parameter:b' as IOType),
      ),
    );

    const attributeMax = maxValueNode ? parseFloat(`${maxValueNode.value}`) : undefined;
    const maxValue = maxAssignedAttribute ? parseFloat(maxAssignedAttribute.value) : attributeMax;

    return {
      ...comp,
      data: JSON.stringify({
        ...data,
        value: valueWithReplacement,
        maxValue,
        url: comp.type === ComponentTypes.IMAGE ? url : data.url,
      }),
    };
  });

  return (
    <main style={{ height: '100vh', width: '100vw' }}>
      <ReadOnlySheet components={componentsWithValues} />
    </main>
  );
};
