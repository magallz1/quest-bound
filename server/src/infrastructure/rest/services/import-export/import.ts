import { dbClient, supabaseClient } from '@/database';
import { RestfulAuthContext } from '@/infrastructure/types';

type ImportRequest = {
  fileKey: string;
  rulesetId: string;
};

export const importAttributes = async (request: ImportRequest, context: RestfulAuthContext) => {
  const db = dbClient();
  const supabase = supabaseClient();

  const { id: userId } = context;
  const { data } = await supabase.storage.from('charts').download(request.fileKey);

  try {
    if (!data) {
      throw Error('Unable to parse chart file');
    }

    const ruleset = await db.ruleset.findUnique({
      where: {
        id: request.rulesetId,
      },
    });

    if (!ruleset) {
      throw Error('Ruleset not found');
    }

    if (ruleset.userId !== userId) {
      throw Error('Unauthorized');
    }

    const parsedData = await data.text();

    const rows: string[][] = parsedData.split('\n').map((row: any) => row.split('\t'));

    const attributes = rows.slice(1).map((row: string[]) => {
      const [id, name, type, defaultValue, description, category, restraints, logic] = row;
      return {
        id: `${id}-${request.rulesetId}`,
        entityId: id,
        rulesetId: request.rulesetId,
        name,
        type,
        defaultValue,
        description,
        category,
        restraints: JSON.parse(restraints),
        logic,
      };
    });

    const attributesWithSortIds = attributes.map((attribute: any, index: number) => ({
      ...attribute,
      sortChildId: attributes[index + 1]?.entityId,
    }));

    await db.attribute.createMany({
      data: attributesWithSortIds,
      skipDuplicates: true,
    });

    await supabase.storage.from('charts').remove([request.fileKey]);

    return {
      body: JSON.stringify({
        data: 'success',
      }),
      statusCode: 200,
    };
  } catch (e: any) {
    await supabase.storage.from('charts').remove([request.fileKey]);
    return {
      body: JSON.stringify({
        message: e.message,
      }),
      statusCode: 400,
    };
  }
};
