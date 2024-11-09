import { AttributeType } from '../gql';

// Character attributeData
export type AttributeData = {
  id: string;
  name: string;
  type: AttributeType;
  source: string;
  value: string;
  maxValue?: number;
  restraints?: string[];
  variation?: string;
  derivedValue?: string;
  logicDisabled?: boolean;
};

export enum Focus {
  Self = 'self',
  Owner = 'owner',
  Target = 'target',
  Region = 'region',
}

export type ItemAttributeData = {
  id: string;
  itemId: string; // The ID of the item which assigned the variation. Used to remove from children when appropriate
  name: string;
  label?: string; // Optionally override the attribute name for each item
  defaultValue: string;
  type: string;
  sideEffects: ItemActionData[];
};

export type ItemActionData = {
  sideEffectOperationId: string; // First attribute in the SE statement
  sideEffectOperationName: string;
  sideEffectAttributes: ItemActionSideEffectAttributeData[];
};

export type ItemActionSideEffectAttributeData = {
  attributeId: string;
  attributeName: string;
  focus: Focus;
};

/*
An action, Equip Armor, increases the owner's Armor Class by the item's Armor Rating, 
then sets the item's Equipped attribute to true.

item: {
  name: 'Leather Armor',
  attributeData: [
    {
      name: 'Equip Armor',
      type: 'ACTION',
      sideEffects: [
        {
          sideEffectOperationName: 'Armor Class',
          sideEffectAttributes: [
            {
              attributeName: 'Armor Class',
              focus: 'owner'
            },
            {
              attributeName: 'Armor Rating',
              focus: 'self'
            }
          ]
        },
        {
          sideEffectOperationName: 'Equipped',
          sideEffectAttributes: [
            {
              attributeName: 'Equipped',
              focus: 'self'
            }
          ]
        }
      ]
    }
  ]
}

*/
