import {
  AttributeType,
  Character,
  Chart,
  ContextualAttribute,
  ContextualItem,
  UpdateCharacterItem,
  useCharacter,
  useCharts,
  useUpdateCharacter,
} from '@/libs/compass-api';
import { Logic, LogicalValue, OperationType } from '@/libs/compass-planes';
import { debugLog, emitter } from '@/libs/compass-web-utils';
import { LogType, useEventLog, useNotifications } from '@/stores';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useRef } from 'react';
import { clampValueToAttributeMinMax, useEvaluateLogic } from '../evaluation';
import { UpdateCharacterAttributeProps } from '../types';
import { useSubscribeAttributeChanges } from '../use-subcribe-attribute-changes';
import { applyAttributeValuesToLogic, applySideEffects } from './apply-side-effects';
import { useAnnouncement } from './use-announcement';

const { warn } = debugLog('use-update-character-attribute');

interface UseUpdateCharacterAttributeProps {
  characterOverride?: Character;
  characterCacheOnly?: boolean;
  _contextualAttributes: ContextualAttribute[];
  _characterId?: string;
  _charts: Chart[];
  items: ContextualItem[];
  logicEnabled: boolean;
  disableLogic: () => void;
  updateItem: (props: UpdateCharacterItem) => void;
  characterItems: ContextualItem[];
  attributeValueMap: Map<string, LogicalValue | null | undefined>;
}

export const useUpdateCharacterAttribute = ({
  characterOverride,
  _contextualAttributes,
  _characterId,
  _charts,
  characterCacheOnly = false,
  characterItems,
  logicEnabled,
  disableLogic,
  attributeValueMap,
  items,
  updateItem,
}: UseUpdateCharacterAttributeProps) => {
  const { addNotification } = useNotifications();
  // Need to await charts and character before bootstrapping automation
  const { loading: chartsLoading } = useCharts();
  const { loading: characterLoading } = useCharacter(_characterId);
  const { announce } = useAnnouncement();
  const { updateCharacter } = useUpdateCharacter(200);
  const { logEvent } = useEventLog();

  const { evaluateLogic, deriveLogicResult } = useEvaluateLogic({
    charts: _charts,
    attributes: _contextualAttributes,
    items,
  });

  useSubscribeAttributeChanges({
    updateCharacterAttribute,
    items,
    contextualAttributes: _contextualAttributes,
    loading: false,
    disableLogic: () => {
      addNotification({
        status: 'error',
        message: 'Too many evaluations. Logic disabled.',
      });
      disableLogic();
    },
  });

  const automationBootstrapped = useRef<boolean>(false);

  useEffect(() => {
    if (
      _contextualAttributes.length > 0 &&
      !!_characterId &&
      !chartsLoading &&
      !characterLoading &&
      !automationBootstrapped.current
    ) {
      bootstrapAutomation();
      automationBootstrapped.current = true;
    }
  }, [_contextualAttributes, _characterId, chartsLoading, characterLoading]);

  const debouncedCallSideEffects = useMemo(
    () => debounce(callSideEffectsAndBroadcastEvent, 150),
    [],
  );

  async function updateCharacterAttribute({
    id,
    value,
    valueWithModifiers,
    reenableLogic,
    providedAttributeData,
    providedCharacterId,
    manualChange = true,
    providedCharts,
    logType = LogType.CONTROLLED,
    logSource,
    ignoreNotifications = false,
    ignoreLog = false,
  }: UpdateCharacterAttributeProps) {
    if (!!characterOverride) {
      addNotification({
        message: 'Cannot update character from a stream overlay',
      });
      return;
    }

    const contextualAttributes = providedAttributeData ?? _contextualAttributes;
    const characterId = providedCharacterId ?? _characterId;
    const attribute = contextualAttributes.find((attr) => attr.id === id);
    const charts = providedCharts ?? _charts;

    if (!attribute) {
      warn(`Could not find attribute ${id}`);
      return;
    }

    if (!characterId) {
      warn(`Could not find character ${characterId}`);
      return;
    }

    const logic = attribute.logic as Logic;
    const hasLogic = Boolean(logic.find((op) => op.type === OperationType.Return));

    let _newValue: LogicalValue | null = value ?? attribute.value;

    if (reenableLogic) {
      const logicWithAttributeValues = applyAttributeValuesToLogic(
        logic,
        attributeValueMap,
        contextualAttributes,
      );
      _newValue = deriveLogicResult(logicWithAttributeValues, contextualAttributes) ?? null;
    }

    if (
      attribute.type !== AttributeType.ACTION &&
      _newValue === attributeValueMap.get(id) &&
      automationBootstrapped.current
    ) {
      return;
    }

    const newValue =
      _newValue !== null
        ? `${clampValueToAttributeMinMax(_newValue, logic, attributeValueMap)}`
        : `${_newValue}`;

    attributeValueMap.set(id, newValue);

    let updatedAttrData: ContextualAttribute[] = contextualAttributes.map((attrData) => {
      if (attrData.id !== id) {
        return {
          ...attrData,
          value:
            attributeValueMap.get(attrData.id) !== undefined
              ? `${attributeValueMap.get(attrData.id)}`
              : attrData.value,
          logic: applyAttributeValuesToLogic(
            attrData.logic,
            attributeValueMap,
            _contextualAttributes,
          ),
        };
      }
      return {
        ...attrData,
        value: newValue ?? attrData.value,
        valueWithModifiers,
        logic: applyAttributeValuesToLogic(
          attrData.logic,
          attributeValueMap,
          _contextualAttributes,
        ),
        logicDisabled: reenableLogic
          ? false
          : attrData.logicDisabled
            ? true
            : manualChange && hasLogic,
      };
    });

    updateCharacter(
      {
        id: characterId,
        attributeData: JSON.stringify(updatedAttrData),
      },
      { cacheOnly: characterCacheOnly },
    );

    const sideEffectCall = manualChange
      ? debouncedCallSideEffects
      : callSideEffectsAndBroadcastEvent;

    sideEffectCall({
      attribute,
      ignoreLog,
      logType,
      logSource,
      newValue,
      logic,
      updatedAttrData,
      ignoreNotifications,
      characterId,
      charts,
    });
  }

  function callSideEffectsAndBroadcastEvent({
    attribute,
    logType,
    ignoreLog,
    logSource,
    newValue,
    logic,
    updatedAttrData,
    ignoreNotifications,
    characterId,
    charts,
  }: {
    attribute: ContextualAttribute;
    logType: LogType;
    ignoreLog: boolean;
    logSource?: string;
    newValue: LogicalValue | null;
    logic: Logic;
    updatedAttrData: ContextualAttribute[];
    ignoreNotifications: boolean;
    characterId: string;
    charts: Chart[];
  }) {
    if (!ignoreLog) {
      logEvent({
        type: logType,
        source: logSource ?? attribute.name,
        message: `${attribute.name} updated to ${newValue}`,
      });
    }

    applySideEffects({
      attributeName: attribute.name,
      logic,
      evaluateLogic,
      attributeValueMap,
      items: characterItems,
      attributes: _contextualAttributes,
      data: updatedAttrData,
      characterId,
      updateItem,
      updateCharacterAttribute,
      addNotification: (message: LogicalValue, announcementId?: string) => {
        if (ignoreNotifications) return;
        announce({
          message,
          announcementId,
        });
      },
    });

    if (logicEnabled) {
      emitter.emit(`attribute:${attribute.id}:change`, updatedAttrData, characterId, charts);
    }
  }

  function bootstrapAutomation() {
    const allAttributes = _contextualAttributes.filter((attr) => {
      return attr.type !== AttributeType.ACTION;
    });

    for (const attr of allAttributes) {
      const res = deriveLogicResult(attr.logic);

      if (res !== attr.value) {
        attributeValueMap.set(attr.id, res);
      }
    }

    for (const attr of allAttributes) {
      updateCharacterAttribute({
        id: attr.id,
        value: attributeValueMap.get(attr.id) ?? attr.value,
        ignoreNotifications: true,
        ignoreLog: true,
        manualChange: false,
      });
    }
  }

  return {
    updateCharacterAttribute,
  };
};
