import { attribute } from './attribute';
import { attributes } from './attributes';
import { createAttribute } from './create-attribute';
import { deleteAttribute } from './delete-attribute';
import { updateAttribute } from './update-attribute';
import { updateAttributeOrder } from './update-attribute-order';

export const attributeResolvers = {
  Query: {
    attribute,
    attributes,
  },
  Mutation: {
    createAttribute,
    updateAttribute,
    deleteAttribute,
    updateAttributeOrder,
  },
};
