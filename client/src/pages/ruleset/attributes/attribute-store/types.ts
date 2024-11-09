import { Attribute, Character, Chart, ContextualAttribute } from '@/libs/compass-api';
import { Logic, LogicalValue } from '@/libs/compass-planes';
import { LogType } from '@/stores';

export type ContextualAttributeDependency = {
  name: string;
  id: string;
};

export type ContextualAttributeModifier = {
  sourceAttributeId: string;
  sourceAttributeName: string;
  logic: Logic;
};

export type IAttributeContext = {
  /**
   * The ruleset's attributes merged with their values from a character when one is available in context
   */
  attributes: ContextualAttribute[];
  updateCharacterAttribute: (props: UpdateCharacterAttributeProps) => Promise<void>;
  getAttribute: (id?: string | null) => ContextualAttribute | undefined;
  triggerAction: (attributeId: string) => void;
  loading: boolean;
};

export interface UseAttributeStateProps {
  characterId?: string;
  characterCacheOnly?: boolean;
  archetypeId?: string;
  characterOverride?: Character;
  attributesOverride?: Attribute[];
  chartsOverride?: Chart[];
  enableLogic?: boolean;
  setEnableLogic?: (enable: boolean) => void;
}

export interface UpdateCharacterAttributeProps {
  id: string;
  value?: LogicalValue;
  valueWithModifiers?: LogicalValue | null;
  reenableLogic?: boolean;
  manualChange?: boolean;
  actionName?: string;
  providedAttributeData?: ContextualAttribute[];
  providedCharacterId?: string;
  providedCharts?: Chart[];
  logType?: LogType;
  logSource?: string;
  ignoreNotifications?: boolean;
  ignoreLog?: boolean;
}
