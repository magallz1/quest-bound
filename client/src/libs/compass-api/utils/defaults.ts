export const DEFAULT_FONT_SIZE = '16px';

export const getDefaultRegionInput = (worldId: string) => ({
  name: 'The Material Plane',
  worldId,
  description:
    'The essence of mortal life and occurrence. The universe as most observe it, but certainly not the extent of existence.',
  area: 0,
  population: {
    total: 0,
    archetypeDistributions: [],
  },
  parentId: null,
});

export const defaultRegionPageContent = (pageName: string, pageId?: string): string => {
  return `{
    "root": {
        "children": [
            {
                "children": [
                    {
                        "detail": 0,
                        "format": 0,
                        "mode": "normal",
                        "style": "font-size: 48px;",
                        "text": "${pageName}",
                        "type": "text",
                        "version": 1
                    }
                ],
                "direction": "ltr",
                "format": "",
                "indent": 0,
                "type": "heading",
                "version": 1,
                "tag": "h1"
            },
            {
                "type": "horizontalrule",
                "version": 1
            },
            {
                "children": [],
                "direction": null,
                "format": "",
                "indent": 0,
                "type": "paragraph",
                "version": 1
            }
        ],
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "type": "root",
        "version": 1
    }
}`;
};

export const defaultRegionCanvas = {
  elementId: '',
  elements: JSON.stringify([]),
  state: JSON.stringify({
    viewBackgroundColor: '#2E2C29',
    currentItemFontFamily: 2,
    currentItemBackgroundColor: '#417090',
    currentItemStrokeColor: '#000',
    currentItemFillStyle: 'solid',
    currentItemStrokeWidth: 1,
    currentItemStrokeStyle: 'solid',
    currentItemRoughness: 0,
    currentItemOpacity: 100,
    zenModeEnabled: true,
    activeTool: {
      type: 'selection',
      locked: true,
      customType: null,
      lastActiveToolBeforeEraser: null,
    },
  }),
};
