import {
  ArchetypeContext,
  AttributeContext,
  ComponentTypes,
  ContentComponentData,
  SheetComponent,
  useCharacter,
} from '@/libs/compass-api';
import { bootstrapContent, convertToRaw, EditorState, Journal } from '@/libs/compass-web-journal';
import { JournalToolbar } from '@/libs/compass-web-journal/components/toolbar';
import { useReplaceVariableText } from '@/libs/compass-web-utils';
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NodeToolbar, useNodeId } from 'reactflow';
import ResizableNodeWrapper from '../../common/components/resizable-node-wrapper';
import { useEditorStore } from '../editor-store';
import { useNodeSize, useSubscribeComponentChanges } from '../hooks';
import { getBorderStyles } from '../utils';

export const ContentNode = () => {
  const getComponent = useEditorStore((state) => state.getComponent);
  const viewMode = useEditorStore((state) => state.viewMode);
  const sheetId = useEditorStore((state) => state.sheetId);
  const updateComponent = useEditorStore((state) => state.updateComponent);

  const id = useNodeId();

  const component = getComponent(id);

  const _key = useSubscribeComponentChanges(id);

  const { characterId } = useParams();
  const { character } = useCharacter(characterId);
  const { attributes } = useContext(AttributeContext);

  const key = `${component?.id ?? ''}-${component?.sheetId}`;

  const [editMoalOpen, setEditModalOpen] = useState(false);

  const isNotesType = component?.type === ComponentTypes.NOTES;
  const readOnlyUnlessLocked = !isNotesType;
  const disableEditMode = isNotesType && !viewMode;

  const { height, width } = useNodeSize(component?.id ?? '');
  const zoom = 1.5;

  const css = JSON.parse(component?.style ?? '{}');
  const data = JSON.parse(component?.data ?? '{}') as ContentComponentData;

  const archetypeContext = useContext(ArchetypeContext);

  const entityDescription = character?.description ?? archetypeContext?.archetype?.description;

  const useEntityDescription = data.useEntityDescription && !!entityDescription;

  const componentContentRaw = useEntityDescription ? entityDescription : data.content;

  const componentContent = bootstrapContent(componentContentRaw);

  // Serializing and de-serializing causes the selection to be lost
  const [journalState, setJournalState] = useState<EditorState>(componentContent);

  useEffect(() => {
    setJournalState(bootstrapContent(componentContentRaw));
  }, [useEntityDescription, key]);

  const parsedJournalState = JSON.stringify(convertToRaw(journalState.getCurrentContent()));
  const injectedText = useReplaceVariableText(parsedJournalState, attributes, data.announcementId);

  if (!component) return null;

  const readOnly =
    viewMode ||
    useEntityDescription ||
    disableEditMode ||
    (readOnlyUnlessLocked && !component.locked);

  const handleChange = (content: EditorState) => {
    if (readOnly && !editMoalOpen) return;
    setJournalState(content);
    updateComponent({
      sheetId,
      update: {
        id: component.id,
        data: JSON.stringify({
          content: JSON.stringify(convertToRaw(content.getCurrentContent())),
        }),
      },
    });
  };

  return (
    <>
      <ResizableNodeWrapper component={component} key={_key}>
        {!readOnly && (
          <NodeToolbar>
            <JournalToolbar
              maxWidth={`${parseInt(width) * zoom}px`}
              state={readOnly ? bootstrapContent(injectedText) : journalState}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </NodeToolbar>
        )}
        <Box
          key={key}
          className={viewMode && isNotesType ? 'clickable' : undefined}
          onClick={() => {
            if (viewMode && isNotesType) {
              setEditModalOpen(true);
            }
          }}
          sx={{
            overflow: 'auto',
            height,
            width,
            opacity: css.opacity,
            color: css.color,
            backgroundColor: css.backgroundColor,
            userSelect: 'none !important',
            WebkitUserSelect: 'none !important',
            ...getBorderStyles(css),
          }}>
          <Journal
            readOnly={readOnly}
            content={readOnly ? bootstrapContent(injectedText) : journalState}
            onChange={handleChange}
            style={{ userSelect: readOnly ? 'none' : undefined }}
          />
        </Box>
      </ResizableNodeWrapper>
      <Modal isOpen={editMoalOpen} onClose={() => setEditModalOpen(false)} size='full'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Notes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={1}>
              <JournalToolbar state={journalState} onChange={handleChange} />

              <Journal content={journalState} onChange={handleChange} />
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export const PrimitiveContentNode = ({ component }: { component: SheetComponent }) => {
  const data = JSON.parse(component.data) as ContentComponentData;
  const css = JSON.parse(component.style);

  const componentContent = bootstrapContent(data.content);

  const height = `${component.height}px`;
  const width = `${component.width}px`;

  return (
    <Box
      sx={{
        overflow: 'auto',
        height,
        width,
        opacity: css.opacity,
        color: css.color,
        backgroundColor: css.backgroundColor,
        userSelect: 'none !important',
        WebkitUserSelect: 'none !important',
        ...getBorderStyles(css),
      }}>
      <Journal
        readOnly
        onChange={() => {}}
        content={componentContent}
        style={{ userSelect: 'none' }}
      />
    </Box>
  );
};
