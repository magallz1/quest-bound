import { ComponentTypes } from '@/libs/compass-api';
import { ClickAwayListener } from '@/libs/compass-core-ui';
import { useKeyListeners } from '@/libs/compass-web-utils';
import { Input, Stack, Text, Tooltip } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useViewport } from 'reactflow';
import { Coordinates } from '../../types';
import { EditorMenuOption } from '../nodes';

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  x: number;
  y: number;
  options: EditorMenuOption[];
  onSelect: (nodeType: ComponentTypes, coordinates: Coordinates, zoom: number) => void;
}

export const ContextMenu = ({
  isOpen,
  onClose,
  onSelect,
  options,
  x: _x,
  y: _y,
}: ContextMenuProps) => {
  const [filterValue, setFilterValue] = useState<string>('');

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(filterValue.toLowerCase()),
  );

  const selection = filteredOptions[0];

  const { x: viewportX, y: viewportY, zoom } = useViewport();
  const x = _x - 240;
  const y = _y - 130;

  const rightWindowBoundary = window.innerWidth - 350;
  const bottomWindowBoundary = window.innerHeight - 250;
  const leftWindowBoundary = 350;

  const relativeX = x - viewportX;
  const relativeY = y - viewportY;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, inputRef.current]);

  const handleClose = () => {
    setFilterValue('');
    onClose();
  };

  const handleCreate = (nodeType: ComponentTypes) => {
    onSelect(nodeType, { x: relativeX, y: relativeY }, zoom);
    handleClose();
  };

  useKeyListeners({
    disabled: !isOpen,
    onKeyDown: (e) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'Enter') {
        if (filteredOptions.length > 0) {
          handleCreate(selection.nodeType);
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
          left: _x > rightWindowBoundary ? undefined : _x < leftWindowBoundary ? 0 : x,
          right: _x > rightWindowBoundary ? 0 : undefined,
          zIndex: 10,
          backgroundColor: '#42403D',
        }}>
        <Input
          ref={inputRef}
          size='s'
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder='Filter'
          style={{ position: 'sticky', top: 0, zIndex: 1 }}
        />

        <Stack style={{ overflowY: 'scroll', flexGrow: 1 }}>
          {!filteredOptions.length && (
            <Text size='s' fontStyle='italic'>
              No options found
            </Text>
          )}
          {filteredOptions.map((option, i) => (
            <Stack key={i} spacing={1}>
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
                    handleCreate(option.nodeType);
                  }}>
                  {option.name}
                </Text>
              </Tooltip>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </ClickAwayListener>
  );
};
