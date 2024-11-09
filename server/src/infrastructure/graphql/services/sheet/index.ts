import { createSheet } from './create-sheet';
import { deleteSheet } from './delete-sheet';
import { sheet } from './sheet';
import { sheetTemplates } from './sheet-templates';
import { updateSheet } from './update-sheet';

export const sheetResolvers = {
  Query: {
    sheet,
    sheetTemplates,
  },
  Mutation: {
    createSheet,
    updateSheet,
    deleteSheet,
  },
};
