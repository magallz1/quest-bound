import { dbClient } from '@/database';
import { RestfulAuthContext } from '@/infrastructure/types';
import { isWithinInterval, subDays } from 'date-fns';

const PASSWORD = process.env.APP_METRICS_PASSWORD;

interface AppMetricsParams {
  password: string;
}

export const appMetrics = async (params: AppMetricsParams, context: RestfulAuthContext) => {
  try {
    if (params.password !== PASSWORD) {
      throw Error('Unauthorized');
    }

    const db = dbClient();

    const totalUsers = await db.user.findMany({
      select: { id: true, role: true, metadata: true, membershipExpiration: true },
    });

    const officialContent = await db.officialContent.findMany({ select: { entityId: true } });
    const customRulesets = await db.ruleset.findMany({
      select: {
        id: true,
        publishedRulesetId: true,
        sheets: {
          select: {
            type: true,
            templateType: true,
            pageId: true,
            components: {
              select: {
                id: true,
              },
            },
          },
        },
        attributes: { select: { id: true, logic: true } },
        charts: { select: { id: true } },
        documents: { select: { id: true } },
        archetypes: { select: { id: true } },
      },
    });
    const publishedRulesets = await db.publishedRuleset.findMany({ select: { id: true } });
    const characters = await db.character.findMany({ select: { id: true } });

    const freeUsers = totalUsers.filter((user: any) => user.role === 'USER');
    const creators = totalUsers.filter((user: any) => user.role === 'CREATOR');
    const legacyCreators = creators.filter((user: any) => user.membershipExpiration === null);
    const publishers = totalUsers.filter((user: any) => user.role === 'PUBLISHER');

    const activeLastMonth = totalUsers.filter((user: any) => {
      const metadata = user.metadata as any;
      const lastLogin = metadata.lastLogin;
      const today = new Date();
      return isWithinInterval(new Date(lastLogin), { start: subDays(today, 30), end: today });
    });

    const activeLastThreeMonths = totalUsers.filter((user: any) => {
      const metadata = user.metadata as any;
      const lastLogin = metadata.lastLogin;
      const today = new Date();
      return isWithinInterval(new Date(lastLogin), { start: subDays(today, 90), end: today });
    });

    const totalRulesets = customRulesets.filter(
      (ruleset: any) =>
        !officialContent.find((oc: any) => ruleset.publishedRulesetId === oc.entityId),
    );

    const totalPublishedRulesets = publishedRulesets.filter(
      (ruleset: any) => !officialContent.find((oc: any) => ruleset.id === oc.entityId),
    );

    let totalSheetTemplates = 0;
    let totalPageTemplates = 0;
    let totalPageCount = 0;
    let totalAttributeCount = 0;
    let totalAttributeWithLogicCount = 0;
    let totalChartCount = 0;
    let totalDocumentCount = 0;
    let totalArchetypeCount = 0;
    let totalComponentCount = 0;
    let highestComponentCount = 0;
    let highestComponentCountRulesetId = null;
    let highestAttributeCount = 0;
    let highestAttributeCountRulesetId = null;

    for (const rs of totalRulesets) {
      for (const sheet of rs.sheets) {
        if (sheet.templateType === 'PAGE') {
          totalPageTemplates++;
        }
        if (sheet.templateType === 'SHEET') {
          totalSheetTemplates++;
        }
        if (sheet.pageId) {
          totalPageCount++;
        }

        totalComponentCount += sheet.components.length;

        if (sheet.components.length > highestComponentCount) {
          highestComponentCount = sheet.components.length;
          highestComponentCountRulesetId = rs.id;
        }
      }
      totalAttributeCount += rs.attributes.length;

      if (rs.attributes.length > highestAttributeCount) {
        highestAttributeCount = rs.attributes.length;
        highestAttributeCountRulesetId = rs.id;
      }

      totalChartCount += rs.charts.length;
      totalDocumentCount += rs.documents.length;
      totalArchetypeCount += rs.archetypes.length;

      for (const attribute of rs.attributes) {
        if (attribute.logic !== '[]') {
          totalAttributeWithLogicCount++;
        }
      }
    }

    function roundToTwo(num: number) {
      return Math.round(num * 100) / 100;
    }

    const response = {
      userCount: totalUsers.length,
      activeLastMonth: activeLastMonth.length,
      activeLastThreeMonths: activeLastThreeMonths.length,
      freeUserCount: freeUsers.length,
      creatorCount: creators.length,
      publisherCount: publishers.length,
      legacyCreatorCount: legacyCreators.length,
      customRulesetCount: totalRulesets.length,
      publishedRulesetCount: totalPublishedRulesets.length,
      characterCount: characters.length,
      averageSheetTemplatesPerRuleset: roundToTwo(totalSheetTemplates / totalRulesets.length),
      averagePageTemplatesPerRuleset: roundToTwo(totalPageTemplates / totalRulesets.length),
      averagePagesPerRuleset: roundToTwo(totalPageCount / totalRulesets.length),
      averageAttributesPerRuleset: roundToTwo(totalAttributeCount / totalRulesets.length),
      averageChartsPerRuleset: roundToTwo(totalChartCount / totalRulesets.length),
      averageDocumentsPerRuleset: roundToTwo(totalDocumentCount / totalRulesets.length),
      averageArchetypesPerRuleset: roundToTwo(totalArchetypeCount / totalRulesets.length),
      averageAttributesWithLogicPerRuleset: roundToTwo(
        totalAttributeWithLogicCount / totalRulesets.length,
      ),
      averageComponentsPerSheet: roundToTwo(
        totalComponentCount / (totalSheetTemplates + totalPageCount + totalPageTemplates),
      ),
      highestComponentCount,
      highestComponentCountRulesetId,
      highestAttributeCount,
      highestAttributeCountRulesetId,
    };

    return {
      body: JSON.stringify(response),
      statusCode: 200,
    };
  } catch (e) {
    return {
      body: JSON.stringify(e),
      statusCode: 400,
    };
  }
};
