import { dbClient } from '@/database';
import { restfulAuthorizer } from '@/infrastructure/authorization';
import { Express } from 'express';

export function registerExportRoute(app: Express) {
  app.post('/export', async (req, res) => {
    try {
      const db = dbClient();
      const context = await restfulAuthorizer({ token: req.get('Authorization') });

      if (!context) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { id: userId } = context;

      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          rulesets: {
            include: {
              attributes: true,
              archetypes: true,
              pages: {
                include: {
                  sheet: {
                    include: {
                      components: {
                        include: {
                          images: {
                            select: {
                              imageId: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              documents: true,
              charts: true,
              sheets: {
                include: {
                  components: {
                    include: {
                      images: {
                        select: {
                          imageId: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const images = await db.image.findMany({
        where: {
          userId,
        },
      });

      const characters = await db.character.findMany({
        where: {
          userId,
        },
      });

      if (!user) {
        throw Error('User not found');
      }

      res.json({
        users: [user],
        characters,
        images: images.map((img: any) => ({
          ...img,
          src: img.src?.replace(
            'https://xzccaobtmbflsstgbzxu.supabase.co/storage/v1/object/public',
            '',
          ),
        })),
      });
    } catch (e: any) {
      return {
        body: JSON.stringify({
          message: e.message,
        }),
        statusCode: 400,
      };
    }
  });
}
