import { useAttributes, useCharts } from '@/libs/compass-api';
import { ClickAwayListener, useDeviceSize } from '@/libs/compass-core-ui';
import { useKeyListeners } from '@/libs/compass-web-utils';
import { Input, Stack, Text, Tooltip } from '@chakra-ui/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useViewport } from 'reactflow';
import { useUserContextContent } from '../hooks/use-user-context-content';
import { NodeOption } from '../node-data';
import { LogicContext } from '../provider';
import { Operation, OperationType } from '../types';

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  x: number;
  y: number;
}

export const ContextMenu = ({ isOpen, onClose, x: _x, y: _y }: ContextMenuProps) => {
  const { attributes } = useAttributes();
  const { charts } = useCharts();
  const { addOperation } = useContext(LogicContext);
  const { desktop } = useDeviceSize();

  const { x: viewportX, y: viewportY } = useViewport();
  const x = desktop ? _x - 240 : _x;
  const y = desktop ? _y - 130 : _y;

  const [filterValue, setFilterValue] = useState<string>('');
  const categoryMap = useUserContextContent(filterValue);

  const selection = categoryMap.get(Array.from(categoryMap.keys())[0]);

  const contextMessage =
    !selection || selection.length === 0
      ? /^[0-9]*$/.test(filterValue)
        ? 'Press enter to create a number node'
        : 'Press enter to create a text node'
      : '';

  let rightWindowBoundary = window.innerWidth - 350;
  let bottomWindowBoundary = window.innerHeight - 250;

  const relativeX = x - viewportX;
  const relativeY = y - viewportY;

  if (!desktop) {
    rightWindowBoundary -= 240;
    bottomWindowBoundary -= 130;
  }

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, inputRef.current]);

  const handleAddOperation = (option: NodeOption) => {
    const initialData: Partial<Operation> = {};

    switch (option.type) {
      case OperationType.Attribute:
      case OperationType.Action:
        const attr = attributes.find((attr) => attr.id === option.id);
        if (attr) initialData.attributeRef = attr.id;
        break;
      case OperationType.ChartRef:
        const chart = charts.find((chart) => chart.id === option.id);
        if (chart) initialData.chartRef = chart.id;
        break;
    }

    addOperation(option.type, { x: relativeX, y: relativeY }, initialData);
  };

  const handleClose = () => {
    setFilterValue('');
    onClose();
  };

  useKeyListeners({
    disabled: !isOpen,
    onKeyDown: (e) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'Enter') {
        if (selection && selection.length > 0) {
          handleAddOperation(selection[0]);
          handleClose();
        } else if (/^[0-9]*$/.test(filterValue)) {
          addOperation(
            OperationType.Number,
            { x: relativeX, y: relativeY },
            { value: parseFloat(filterValue) },
          );
          handleClose();
        } else {
          addOperation(OperationType.Text, { x: relativeX, y: relativeY }, { value: filterValue });
          handleClose();
        }
      }
    },
  });

  if (!isOpen) return null;
  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Stack
        padding={2}
        spacing={1}
        width={300}
        maxHeight={350}
        style={{
          position: 'absolute',
          top: _y > bottomWindowBoundary ? undefined : y,
          bottom: _y > bottomWindowBoundary ? 0 : undefined,
          left: _x > rightWindowBoundary ? undefined : x,
          right: _x > rightWindowBoundary ? 0 : undefined,
          zIndex: 10,
          backgroundColor: '#42403D',
        }}>
        <Input
          id='logic-context-filter'
          ref={inputRef}
          size='s'
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder='Filter'
          style={{ position: 'sticky', top: 0, zIndex: 1 }}
        />

        <Stack style={{ overflow: 'auto', flexGrow: 1 }}>
          {!!contextMessage && <Text fontStyle='italic'>{contextMessage}</Text>}
          {Array.from(categoryMap.keys()).map((category, i) => (
            <Stack key={i} spacing={1}>
              <Text key={i} size='s' fontWeight='bold'>
                {category}
              </Text>

              {categoryMap.get(category)?.map((option, i) => (
                <Tooltip
                  key={i}
                  hasArrow
                  placement='left-start'
                  gutter={16}
                  label={!!option.description ? <Text size='s'>{option.description}</Text> : null}
                  aria-label={option.description}
                  shouldWrapChildren>
                  <Text
                    size='s'
                    className='clickable'
                    ml={2}
                    onClick={() => {
                      handleAddOperation(option);
                      handleClose();
                    }}>
                    {option.name}
                  </Text>
                </Tooltip>
              ))}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </ClickAwayListener>
  );
};
