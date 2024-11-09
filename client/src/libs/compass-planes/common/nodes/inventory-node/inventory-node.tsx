import { InventoryComponentData, SheetComponent } from '@/libs/compass-api';
import {
  Center,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Stack,
} from '@chakra-ui/react';
import { Backpack } from '@mui/icons-material';
import { CSSProperties } from 'react';
import { useNodeId } from 'reactflow';
import ResizableNodeWrapper from '../../../common/components/resizable-node-wrapper';
import { useEditorStore } from '../../editor-store';
import { useNodeSize, useSubscribeComponentChanges } from '../../hooks';
import { getBorderStyles } from '../../utils';
import { ItemOptionWindow } from './item-option-window';
import { TextInventoryList } from './text-inventory-list';

export const InventoryNode = () => {
  const getComponent = useEditorStore((state) => state.getComponent);
  const viewMode = useEditorStore((state) => state.viewMode);

  const id = useNodeId();

  const component = getComponent(id);

  const key = useSubscribeComponentChanges(id);

  const { height, width } = useNodeSize(component?.id);

  if (!component) return null;
  const css = JSON.parse(component.style) as CSSProperties;
  const data = JSON.parse(component.data) as InventoryComponentData;

  const componentImageSrcs = component.images?.map((image) => image.src) || [];

  const imageSrc = componentImageSrcs[0];

  const backgroundColor = !!imageSrc ? 'rgba(255,255,255, 0)' : '#42403D';

  return (
    <ResizableNodeWrapper component={component} key={key}>
      <Popover placement='right'>
        <PopoverTrigger>
          {data.isText ? (
            <Stack
              sx={{ height, width, ...css, ...getBorderStyles(css), overflowY: 'auto' }}
              padding={1}>
              <TextInventoryList inventoryId={component.id} />
            </Stack>
          ) : imageSrc ? (
            <Image
              sx={{ height, width, ...css, ...getBorderStyles(css) }}
              key={`${imageSrc}-${data.url}`}
              className={viewMode ? 'clickable' : undefined}
              draggable={false}
              alt={data.alt}
              src={imageSrc ?? undefined}
            />
          ) : (
            <Center
              sx={{ backgroundColor, ...css, height, width, ...getBorderStyles(css) }}
              className={viewMode ? 'clickable' : undefined}>
              {!viewMode && <Backpack />}
            </Center>
          )}
        </PopoverTrigger>
        {viewMode && (
          <Portal>
            <PopoverContent>
              <ItemOptionWindow component={component} />
            </PopoverContent>
          </Portal>
        )}
      </Popover>
    </ResizableNodeWrapper>
  );
};

export const PrimitiveInventoryNode = ({ component }: { component: SheetComponent }) => {
  const data = JSON.parse(component.data) as InventoryComponentData;
  const css = JSON.parse(component.style) as CSSProperties;
  const height = `${component.height}px`;
  const width = `${component.width}px`;
  const componentImageSrcs = component.images?.map((image) => image.src) || [];

  const imageSrc = componentImageSrcs[0];

  const backgroundColor = !!imageSrc ? 'rgba(255,255,255, 0)' : '#42403D';

  return (
    <>
      {data.isText ? (
        <Stack
          sx={{ height, width, ...css, ...getBorderStyles(css), overflowY: 'auto' }}
          padding={1}>
          <TextInventoryList inventoryId={component.id} />
        </Stack>
      ) : imageSrc ? (
        <Image
          sx={{ height, width, ...css, ...getBorderStyles(css) }}
          key={`${imageSrc}-${data.url}`}
          draggable={false}
          alt={data.alt}
          src={imageSrc ?? undefined}
        />
      ) : (
        <Center sx={{ backgroundColor, ...css, height, width, ...getBorderStyles(css) }}></Center>
      )}
    </>
  );
};
