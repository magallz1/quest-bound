import { ComponentTypes } from '@/libs/compass-api';
import { PlaneEditorType } from '@/libs/compass-planes/types';
import { Stack } from '@chakra-ui/react';
import { CSSProperties, ReactNode } from 'react';
import { useEditorStore } from '../../editor-store';
import { ComponentEditActions } from './component-edit-actions';

interface EditBar {
  title?: ReactNode;
  toggleControls?: ReactNode;
  style?: CSSProperties;
  viewMode?: boolean;
  type?: PlaneEditorType;
}

export const EditBar = ({
  viewMode,
  toggleControls,
  title,
  style,
  type = PlaneEditorType.SHEET,
}: EditBar) => {
  const { selectedComponentIds, getComponent } = useEditorStore();
  const selectedComponents = selectedComponentIds
    .map((id) => getComponent(id))
    .filter((c) => c) as any[];

  const selectedComponentIsContent = selectedComponents[0]?.type === ComponentTypes.CONTENT;

  const selectedComponentsKey = selectedComponents.map((c) => c.id).join('-');

  if (selectedComponents.length === 0) return null;

  return (
    <Stack
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      height='60px'
      width='100%'
      maxWidth='90dvw'
      spacing={1}
      sx={{
        gridRow: 1,
        pl: 2,
        pr: 2,
        ...style,
      }}>
      <Stack direction='row' spacing={2} justifyContent='start' alignItems='center' minWidth={300}>
        {toggleControls && toggleControls}

        {!viewMode && selectedComponents.length > 0 && (
          <ComponentEditActions
            components={selectedComponents}
            key={selectedComponentsKey}
            editorType={type}
          />
        )}

        <div id='journal-toolbar' style={selectedComponentIsContent ? {} : { display: 'none' }} />
      </Stack>

      <Stack direction='row' spacing={2} justifyContent='end' alignItems='center'>
        {title && title}
      </Stack>
    </Stack>
  );
};
