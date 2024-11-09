import { ComponentTypes, SheetComponent } from '@/libs/compass-api';
import { Img } from '@/libs/compass-core-composites';
import { IconButton, Text, Tooltip } from '@/libs/compass-core-ui';
import { Popover, PopoverContent, PopoverTrigger, Stack } from '@chakra-ui/react';
import { ArrowDropDown, ArrowDropUp, Layers } from '@mui/icons-material';
import { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { useEditorStore } from '../../../editor-store';
import { getBorderStyles } from '../../../utils';

interface LayerEditProps {
  components: SheetComponent[];
  disabled?: boolean;
}

/***
 * Provides methods for raising and lowering the layer of a component.
 *
 * If one component is selected, the menu will show all intersecting components.
 *
 * If multiple components are selected, the menu will show all selected components.
 */
export const LayerEdit = ({ components, disabled = false }: LayerEditProps) => {
  const { sheetId, updateComponents, components: activeComponents } = useEditorStore();
  const [selectedLayer, setSelectedLayer] = useState<number>(components[0]?.layer ?? 0);

  const { getIntersectingNodes } = useReactFlow();

  const intersectingNodes =
    components.length === 0
      ? []
      : getIntersectingNodes(components[0]).filter((ic) => ic.id !== components[0].id);

  const intersectingComponents = intersectingNodes
    .map((node) => activeComponents.find((c) => c.id === node.id))
    .filter(Boolean) as SheetComponent[];

  const sortedIntersections = intersectingComponents.sort((a, b) => b.layer - a.layer);

  const moveLayer = (component: SheetComponent, newLayer: number) => {
    updateComponents({
      sheetId,
      updates: [
        {
          id: component.id,
          layer: newLayer,
        },
      ],
    });
  };

  const handleUpdate = (layer: number) => {
    // When multiple components are selected, normalize their layers
    setSelectedLayer(layer);
    updateComponents({
      sheetId,
      updates: components.map((comp) => ({
        id: comp.id,
        layer,
      })),
    });
  };

  const ComponentExample = ({ component }: { component: SheetComponent }) => {
    const data = JSON.parse(component.data);
    const css = JSON.parse(component.style);

    const imgSrc = component.images?.[0]?.src;

    switch (component.type) {
      case 'text':
        return (
          <Text
            sx={{
              maxWidth: 100,
              color: css.fontColor,
              fontStyle: css.fontStyle,
              fontWeight: css.fontWeight,
            }}>
            {data.value?.slice(0, 25) ? data.value?.slice(0, 25) + '...' : 'Text'}
          </Text>
        );
      case ComponentTypes.IMAGE:
        return <Img style={{ height: 50, width: 50 }} src={imgSrc ?? undefined} />;

      default:
        return (
          <Stack
            padding={1}
            sx={{
              backgroundColor: css.backgroundColor,
              ...getBorderStyles(css),
            }}
            justifyContent='center'>
            <Text
              variant='subtitle2'
              sx={{
                color: component.type === ComponentTypes.LINE ? css.backgroundColor : css.color,
              }}>
              {component.type}
            </Text>
          </Stack>
        );
    }
  };

  return (
    <>
      <Stack alignItems='center' direction='row'>
        <Tooltip title={disabled ? '' : selectedLayer} placement='top'>
          <IconButton
            onClick={() => handleUpdate(Math.max(1, selectedLayer + 1))}
            disabled={disabled}>
            <ArrowDropUp fontSize='small' />
          </IconButton>
        </Tooltip>

        <Popover>
          <PopoverTrigger>
            <Tooltip title='Layer Menu'>
              <IconButton>
                <Layers fontSize='small' sx={{ color: disabled ? 'grey' : 'inherit' }} />
              </IconButton>
            </Tooltip>
          </PopoverTrigger>
          <PopoverContent>
            <Stack
              minWidth={250}
              maxWidth={800}
              maxHeight={600}
              sx={{ overflowY: 'auto' }}
              padding={2}
              spacing={2}>
              <Text sx={{ width: '100%', textAlign: 'center' }}>Layers</Text>
              {sortedIntersections.map((comp) => (
                <Stack key={comp.id} direction='row' justifyContent='space-between' width='100%'>
                  <ComponentExample key={comp.id} component={comp} />

                  <Stack direction='row' alignItems='center' spacing={1}>
                    <IconButton
                      onClick={() => moveLayer(comp, Math.max(1, comp.layer + 1))}
                      disabled={disabled}>
                      <ArrowDropUp fontSize='small' />
                    </IconButton>

                    <Text variant='subtitle2'>{comp.layer}</Text>

                    <IconButton
                      disabled={disabled || selectedLayer <= 1}
                      onClick={() => moveLayer(comp, Math.max(1, comp.layer - 1))}>
                      <ArrowDropDown fontSize='small' />
                    </IconButton>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </PopoverContent>
        </Popover>

        <Tooltip title={disabled ? '' : selectedLayer}>
          <IconButton
            disabled={disabled || selectedLayer <= 1}
            onClick={() => handleUpdate(Math.max(1, selectedLayer - 1))}>
            <ArrowDropDown fontSize='small' />
          </IconButton>
        </Tooltip>
      </Stack>
    </>
  );
};
