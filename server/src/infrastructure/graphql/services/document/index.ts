import { bootstrapRulebook } from './bootstrap-rulebook';
import { createDocument } from './create-document';
import { deleteBootstrap } from './delete-bootstrap';
import { deleteDocument } from './delete-document';
import { document } from './document';
import { documents } from './documents';
import { updateDocument } from './update-document';

export const documentResolvers = {
  Query: {
    document,
    documents,
  },
  Mutation: {
    createDocument,
    updateDocument,
    deleteDocument,
    bootstrapRulebook,
    deleteBootstrap,
  },
};
