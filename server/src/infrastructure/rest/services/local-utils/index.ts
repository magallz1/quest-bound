import { dbClient, supabaseClient } from '@/database';
import { getCache } from '@/infrastructure/cache';
import { Express } from 'express';
import { v4 as uuid } from 'uuid';

export const initializeLocalUtilRoutes = (app: Express) => {
  app.post('/clear-local-users', async (req, res) => {
    const db = dbClient();
    const supabase = supabaseClient();

    const localEmails = ['sam@questbound.com', 'barnes@questbound.com'];

    for (const email of localEmails) {
      try {
        const user = await db.user.findUnique({
          where: {
            email,
          },
          include: {
            avatar: true,
          },
        });

        await db.licenseKey.delete({
          where: {
            email,
          },
        });

        if (!user) continue;

        // Delete all images associated with user
        await db.image.deleteMany({
          where: {
            userId: user.id,
          },
        });

        // Delete user from database
        await db.user.delete({
          where: {
            id: user.id,
          },
        });

        // Delete user from auth
        await supabase.auth.admin.deleteUser(user.id);

        if (user.avatar?.src) {
          const fileKey = user.avatar.src.split('/public/avatars/')[1];
          await supabase.storage.from('images').remove([decodeURIComponent(fileKey)]);
        }
      } catch (e) {}
    }

    res.send({
      message: 'Local users deleted',
    });
  });

  app.post('/local-util', async (req, res) => {
    try {
      // const db = dbClient();

      res.send({
        message: 'Local utils',
      });
    } catch (e: any) {
      res.send({
        message: `Error. ${e.message}`,
      });
    }
  });

  app.post('/bootstrapstresstest', async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        res.status(400).send({
          message: 'No userId provided',
        });
        return;
      }

      const attributeCount = 100;

      const db = dbClient();
      const cache = getCache();

      const rs = await db.ruleset.create({
        data: {
          title: 'Stress Test',
          userId,
          details: '{}',
        },
      });

      let lastAttributeId = '';

      for (let i = 0; i < attributeCount; i++) {
        const entityId = uuid();
        await db.attribute.create({
          data: {
            id: `${entityId}-${rs.id}`,
            entityId,
            rulesetId: rs.id,
            name: `Attribute ${i}`,
            description: `Description ${i}`,
            logic: !!lastAttributeId ? JSON.stringify(createAddOneLogic(lastAttributeId)) : '[]',
            type: 'NUMBER',
            defaultValue: '0',
          },
        });

        lastAttributeId = entityId;
      }

      cache.del(userId);

      const logcSheetEntityId = uuid();
      const logicTabId = uuid();

      await db.sheet.create({
        data: {
          id: `${logcSheetEntityId}-${rs.id}`,
          rulesetId: rs.id,
          entityId: logcSheetEntityId,
          templateType: 'SHEET',
          type: 'TEMPLATE',
          title: 'Stress test sheet',
          tabs: `[{"title":"New Page","position":0,"tabId":"${logicTabId}","conditionalRenderAttributeId":null}]`,
          details:
            '{"defaultFont":"Roboto Condensed","colors":[],"snapToGrid":true,"enableLogic":true,"renderGrid":"square"}',
        },
      });

      const noLogicSheetEntityId = uuid();
      const noLogicTabId = uuid();

      await db.sheet.create({
        data: {
          id: `${noLogicSheetEntityId}-${rs.id}`,
          rulesetId: rs.id,
          entityId: noLogicSheetEntityId,
          templateType: 'SHEET',
          type: 'TEMPLATE',
          title: 'No logic stress test sheet',
          tabs: `[{"title":"New Page","position":0,"tabId":"${noLogicTabId}","conditionalRenderAttributeId":null}]`,
          details:
            '{"defaultFont":"Roboto Condensed","colors":[],"snapToGrid":true,"enableLogic":true,"renderGrid":"square"}',
        },
      });

      const attributes = await db.attribute.findMany({
        where: {
          rulesetId: rs.id,
        },
      });

      async function createComponent(
        sheetEntityId: string,
        tabId: string,
        index: number,
        columnIndex: number,
        attributeId?: string,
        type?: 'number' | 'text',
      ) {
        const componentEntityId = uuid();
        await db.sheetComponent.create({
          data: {
            id: `${componentEntityId}-${sheetEntityId}-${rs.id}`,
            sheetId: `${sheetEntityId}-${rs.id}`,
            entityId: componentEntityId,
            type: 'text-input',
            layer: 2,
            tabId,
            label: '',
            style: JSON.stringify({
              backgroundColor: '#42403D',
              color: '#FAF7F2',
              fontSize: 16,
              fontWeight: 'normal',
              fontStyle: 'normal',
              textDecoration: 'none',
              fontFamily: 'Roboto Condensed',
              opacity: 1,
              borderRadius: '0%',
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderAllRadius: 0,
              outlineColor: '',
              outlineOffset: 0,
              outlineWidth: 0,
              objectFit: 'cover',
            }),
            data: JSON.stringify({
              attributeId,
              type: type || 'number',
            }),
            x: index * 200 + 20,
            y: columnIndex * 40 + 20,
            width: 200,
            height: 40,
            rotation: 0,
          },
        });
        index++;
      }

      let index = 1;
      let columnIndex = 1;
      for (const attribute of attributes) {
        await createComponent(
          logcSheetEntityId,
          logicTabId,
          index,
          columnIndex,
          attribute.entityId,
        );
        if (index % 6 === 0) {
          columnIndex++;
          index = 0;
        }
        index++;
      }

      index = 1;
      columnIndex = 1;

      for (let i = 0; i < 200; i++) {
        await createComponent(
          noLogicSheetEntityId,
          noLogicTabId,
          index,
          columnIndex,
          undefined,
          'text',
        );
        if (index % 6 === 0) {
          columnIndex++;
          index = 0;
        }
        index++;
      }

      res.send({
        message: 'Bootstrapped stress test',
      });
    } catch (e: any) {
      res.send({
        message: `Error. ${e.message}`,
      });
    }
  });
};

function createAddOneLogic(attributeId: string) {
  const addId = uuid();
  const returnId = uuid();

  return [
    {
      id: uuid(),
      x: 150,
      y: 250,
      type: 'attribute',
      data: { testValue: '1' },
      connections: [{ id: addId, sourceType: 'output', targetType: 'input' }],
      attributeRef: attributeId,
      chartRef: null,
      variableType: 'NUMBER',
      value: null,
    },
    {
      id: addId,
      x: 600,
      y: 425,
      type: 'add',
      data: {},
      connections: [{ id: returnId, sourceType: 'output', targetType: 'input' }],
      attributeRef: null,
      chartRef: null,
      variableType: 'NUMBER',
    },
    {
      id: uuid(),
      x: 538,
      y: 550,
      type: 'number',
      data: {},
      connections: [{ id: addId, sourceType: 'output', targetType: 'input' }],
      attributeRef: null,
      chartRef: null,
      variableType: 'NUMBER',
      value: 1,
    },
    {
      id: returnId,
      x: 814,
      y: 379,
      type: 'return',
      data: {},
      connections: [],
      attributeRef: null,
      chartRef: null,
      variableType: 'NUMBER',
      value: '',
    },
  ];
}
