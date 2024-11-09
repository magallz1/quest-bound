import { AuthorizationContext } from '@/infrastructure/types';
import { BootstrapRulebookMutationVariables } from '../../generated-types';
import { dbClient, supabaseClient } from '@/database';
import { createPageUtil, throwIfUnauthorized } from '../_shared';
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();

export const bootstrapRulebook = async (
  parent: any,
  args: BootstrapRulebookMutationVariables,
  context: AuthorizationContext,
) => {
  const { userPermittedRulesetWriteIds, userPermittedRulesetReadIds } = context;
  const { input } = args;

  throwIfUnauthorized({
    rulesetId: input.rulesetId,
    userPermittedRulesetReadIds,
    userPermittedRulesetWriteIds,
    role: 'write',
  });

  const db = dbClient();
  const supabase = supabaseClient();

  const document = await db.document.findUnique({
    where: {
      id: `${input.id}-${input.rulesetId}`,
    },
  });

  if (!document) {
    throw Error('Document not found.');
  }

  const { data } = await supabase.storage.from('documents').download(document.fileKey);

  if (!data) {
    throw Error('Document can not be retrieved');
  }

  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const pdfData = await pdfExtract.extractBuffer(buffer, {});

  const numPages = pdfData.pages.length;

  const wordMap = new Map<number, string>();

  for (const page of pdfData.pages) {
    const wordArray = page.content;
    if (wordArray && wordArray.length > 0) {
      const largestWord = (wordArray as any[]).reduce((prev, current) => {
        return prev.height > current.height ? prev : current;
      });

      const word = !isNaN(parseInt(largestWord.str))
        ? `Page ${page.pageInfo.num}`
        : largestWord.str;

      wordMap.set(page.pageInfo.num, word);
    } else {
      wordMap.set(page.pageInfo.num, `Page ${page.pageInfo.num}`);
    }
  }

  const pageTitles: string[] = [];

  for (let i = 0; i < numPages; i++) {
    const title = wordMap.get(i + 1);
    if (title) {
      pageTitles.push(title);
    }
  }

  const promises = pageTitles.map((title, i) =>
    createPageUtil({
      db,
      input: { title, rulesetId: input.rulesetId, sortIndex: i },
      bootstrapPageNumber: i + 1,
    }),
  );

  await Promise.all(promises);

  return 'success';
};
