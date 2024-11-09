import { createPage } from './create-page';
import { createPageTemplate } from './create-page-template';
import { deletePage } from './delete-page';
import { page } from './page';
import { pageTemplates } from './page-templates';
import { pages } from './pages';
import { updatePages } from './update-pages';

export const pageResolvers = {
  Query: {
    page,
    pages,
    pageTemplates,
  },
  Mutation: {
    createPage,
    updatePages,
    deletePage,
    createPageTemplate,
  },
};
