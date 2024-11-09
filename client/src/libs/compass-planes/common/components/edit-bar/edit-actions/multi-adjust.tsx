import { SheetComponent } from '@/libs/compass-api';
import { IconButton, Tooltip } from '@/libs/compass-core-ui';
import { Button, Popover, PopoverContent, PopoverTrigger, Stack } from '@chakra-ui/react';
import { AspectRatio } from '@mui/icons-material';
import { useReactFlow } from 'reactflow';
import { useEditorStore } from '../../../editor-store';

interface MultiAdjustProps {
  components: SheetComponent[];
  disabled?: boolean;
}

export const MultiAdjust = ({ disabled }: MultiAdjustProps) => {
  const { updateComponents, sheetId } = useEditorStore();
  const allComponents = useEditorStore((state) => state.components);
  const selectedIds = useEditorStore((state) => state.selectedComponentIds);
  const components = allComponents.filter((c) => selectedIds.includes(c.id));

  const reactFlow = useReactFlow();

  const updateNodes = (
    updatedComponents: {
      [x: string]: string | number;
      id: string;
    }[],
  ) => {
    reactFlow.setNodes((prev) =>
      prev.map((node) => {
        if (updatedComponents.find((u) => u.id === node.id)) {
          const update = updatedComponents.find((u) => u.id === node.id);

          if (!update) return node;
          const x = update.x !== undefined ? parseFloat(`${update.x}`) : node.position.x;
          const y = update.y !== undefined ? parseFloat(`${update.y}`) : node.position.y;
          const height = update.height !== undefined ? parseFloat(`${update.height}`) : node.height;
          const width = update.width !== undefined ? parseFloat(`${update.width}`) : node.width;

          return {
            ...node,
            position: {
              x,
              y,
            },
            height,
            width,
          };
        }
        return node;
      }),
    );
  };

  const fitTo = (increase: boolean, height: boolean) => {
    const property = height ? 'height' : 'width';
    let targetValue = components[0][property];
    for (const component of components) {
      if (increase) {
        targetValue = Math.max(targetValue, component[property]);
      } else {
        targetValue = Math.min(targetValue, component[property]);
      }
    }

    const updatedComponents = components
      .filter((c) => !c.locked)
      .map((c) => ({
        id: c.id,
        [property]: targetValue,
      }));

    updateComponents({
      sheetId,
      updates: updatedComponents,
    });

    updateNodes(updatedComponents);
  };

  const align = (direction: 'left' | 'right' | 'top' | 'bottom') => {
    const lowestY = components.reduce((lowest, c) => Math.min(lowest, c.y), Infinity);
    const lowestX = components.reduce((lowest, c) => Math.min(lowest, c.x), Infinity);
    const greatestY = components.reduce(
      (greatest, c) => Math.max(greatest, c.y + c.height),
      -Infinity,
    );
    const greatestX = components.reduce(
      (greatest, c) => Math.max(greatest, c.x + c.width),
      -Infinity,
    );

    const property = direction === 'left' || direction === 'right' ? 'x' : 'y';
    const targetValue = (() => {
      switch (direction) {
        case 'left':
          return lowestX;
        case 'right':
          return greatestX;
        case 'top':
          return lowestY;
        case 'bottom':
          return greatestY;
      }
    })();

    const updatedComponents = components
      .filter((c) => !c.locked)
      .map((c) => {
        const value =
          direction === 'right'
            ? targetValue - c.width
            : direction === 'bottom'
              ? targetValue - c.height
              : targetValue;
        return {
          id: c.id,
          [property]: value,
        };
      });

    updateComponents({
      sheetId,
      updates: updatedComponents,
    });

    updateNodes(
      updatedComponents.map((u) => ({
        id: u.id,
        x: u.x as number,
        y: u.y as number,
      })),
    );
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Tooltip title='Adjust'>
            <IconButton disabled={disabled}>
              <AspectRatio fontSize='small' />
            </IconButton>
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent>
          <Stack p={2} spacing={1} justify='center' align='center'>
            <Button variant='text' sx={{ width: 150 }} onClick={() => fitTo(true, false)}>
              Fit to Widest
            </Button>

            <Button variant='text' sx={{ width: 150 }} onClick={() => fitTo(false, false)}>
              Fit to Thinnest
            </Button>

            <Button variant='text' sx={{ width: 150 }} onClick={() => fitTo(true, true)}>
              Fit to Tallest
            </Button>

            <Button variant='text' sx={{ width: 150 }} onClick={() => fitTo(false, true)}>
              Fit to Shortest
            </Button>

            <Button variant='text' sx={{ width: 150 }} onClick={() => align('top')}>
              Align Top
            </Button>

            <Button variant='text' sx={{ width: 150 }} onClick={() => align('bottom')}>
              Align Bottom
            </Button>

            <Button variant='text' sx={{ width: 150 }} onClick={() => align('left')}>
              Align Left
            </Button>

            <Button variant='text' sx={{ width: 150 }} onClick={() => align('right')}>
              Align Right
            </Button>
          </Stack>
        </PopoverContent>
      </Popover>
    </>
  );
};
