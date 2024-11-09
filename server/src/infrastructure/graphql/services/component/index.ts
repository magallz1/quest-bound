import { sheetComponents } from './components';
import { createSheetComponents } from './create-components';
import { deleteSheetComponents } from './delete-components';
import { updateSheetComponents } from './update-components';

export const componentResolvers = {
  Query: {
    sheetComponents,
  },
  Mutation: {
    createSheetComponents,
    updateSheetComponents,
    deleteSheetComponents,
  },
};
