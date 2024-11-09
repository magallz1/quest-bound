import { SheetComponentValue } from './base-component-types';

export const defaultNoteComponentContent =
  '{"blocks":[{"key":"55rv6","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';

export const defaultContentComponentContent =
  '{"blocks":[{"key":"55rv6","text":"New Page","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"1q720","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"aq1st","text":"This is a content component. Unlock it to move, scale or style the component.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"22ovj","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"48l","text":"Lock this component to edit its contents.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';

export const MAX_SIZE = 200;
export const DEFAULT_GRID_SIZE = 20;

export const defaultSheetEmptyValue: SheetComponentValue = {
  data: JSON.stringify({}),
  style: JSON.stringify({
    backgroundColor: '',
    color: '',
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
};
