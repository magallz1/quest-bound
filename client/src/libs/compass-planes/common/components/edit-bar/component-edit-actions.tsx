import { ComponentTypes, SheetComponent } from '@/libs/compass-api';
import { PlaneEditorType } from '@/libs/compass-planes/types';
import { Stack } from '@chakra-ui/react';
import {
  AnnouncementEdit,
  BoxEdit,
  ChartEdit,
  CheckboxEdit,
  CssEdit,
  ImageEdit,
  InputEdit,
  InventoryEdit,
  LayerEdit,
  PdfEdit,
  TextEdit,
} from './edit-actions';
import { ConditionalRenderEdit } from './edit-actions/conditional-render-edit';
import { ContentEdit } from './edit-actions/content-edit';
import { FrameEdit } from './edit-actions/frame-edit';
import { GraphEdit } from './edit-actions/graph-edit';
import { GroupEdit } from './edit-actions/group-edit';
import { LineEdit } from './edit-actions/line-edit';
import { LockEdit } from './edit-actions/lock-edit';
import { MultiAdjust } from './edit-actions/multi-adjust';

interface Props {
  components: SheetComponent[];
  editorType?: PlaneEditorType;
}

export const ComponentEditActions = ({ components, editorType = PlaneEditorType.SHEET }: Props) => {
  const hasType = (type: ComponentTypes) => components.some((c) => c.type === type);
  const anyComponentIsLocked = components.some((c) => c.locked);

  return (
    <Stack
      direction='row'
      alignItems='center'
      height={'60px'}
      flexWrap='wrap'
      id='component-edit-bar'
      aria-label='Component edit actions'
      p={2}
      spacing={2}
      style={{
        backgroundColor: 'rgba(66,64,61,0.8)',
        borderRadius: '8px',
      }}
      tabIndex={0}>
      <>
        <LockEdit components={components} />
        {!anyComponentIsLocked && (
          <>
            <GroupEdit />

            <LayerEdit components={components} />

            {editorType === PlaneEditorType.SHEET && (
              <>
                <ConditionalRenderEdit components={components} />
                <AnnouncementEdit components={components} />
              </>
            )}

            {hasType(ComponentTypes.TEXT) && <TextEdit components={components} />}

            {hasType(ComponentTypes.SHAPE) && <BoxEdit components={components} />}

            {hasType(ComponentTypes.IMAGE) && <ImageEdit components={components} />}

            {hasType(ComponentTypes.CHECKBOX) && <CheckboxEdit components={components} />}

            {hasType(ComponentTypes.INPUT) && <InputEdit components={components} />}

            {hasType(ComponentTypes.INVENTORY) && <InventoryEdit components={components} />}

            {components.length === 1 && (
              <>
                {hasType(ComponentTypes.LINE) && <LineEdit component={components[0]} />}
                {hasType(ComponentTypes.FRAME) && <FrameEdit component={components[0]} />}
                {hasType(ComponentTypes.GRAPH) && <GraphEdit component={components[0]} />}
                {hasType(ComponentTypes.CONTENT) && <ContentEdit component={components[0]} />}
                {hasType(ComponentTypes.CHART) && <ChartEdit component={components[0]} />}
                {hasType(ComponentTypes.PDF) && <PdfEdit component={components[0]} />}
              </>
            )}

            {components.length > 1 && <MultiAdjust components={components} />}

            <CssEdit components={components} />
          </>
        )}
      </>
    </Stack>
  );
};
