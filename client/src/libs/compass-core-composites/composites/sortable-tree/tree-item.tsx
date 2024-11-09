import { ClickAwayListener, IconButton, Stack, Text } from '@/libs/compass-core-ui';
import { useKeyListeners } from '@/libs/compass-web-utils';
import CloseIcon from '@mui/icons-material/Close';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import classNames from 'classnames';
import React, {
  CSSProperties,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './TreeItem.module.css';

export interface Props extends Omit<HTMLAttributes<HTMLLIElement>, 'id' | 'onSelect'> {
  value: string;
  depth: number;
  selected?: boolean;
  selectedStyle?: any;
  leaf?: boolean;
  dirIcon?: ReactNode;
  dragHandle?: boolean;
  dragHandleStyle?: React.CSSProperties;
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  readOnly?: boolean;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indicator?: boolean;
  indentationWidth: number;
  hoveredStyle?: CSSProperties;
  onCollapse?(): void;
  onRemove?(): void;
  wrapperRef?(node: HTMLLIElement): void;
  onSelect?: () => void;
  onUpdateName?: (name: string) => void;
}

export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      selected = false,
      selectedStyle = { bgcolor: 'info.main' },
      ghost,
      leaf,
      dirIcon,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      readOnly = false,
      onCollapse,
      onRemove,
      onSelect,
      style,
      value,
      wrapperRef,
      dragHandle = false,
      dragHandleStyle,
      onUpdateName,
      hoveredStyle,
      ...props
    },
    ref,
  ) => {
    const handleCollapse = (e: React.MouseEvent) => {
      e.stopPropagation();
      onCollapse?.();
    };

    const editInputRef = useRef<HTMLInputElement>(null);

    const [newName, setNewName] = useState<string>(value);
    const [editing, setEditing] = useState<boolean>(false);

    useEffect(() => {
      if (editing) {
        editInputRef.current?.focus();
      }
    }, [editing]);

    useKeyListeners({
      disabled: !editing,
      blockPropagation: true,
      onKeyDown: (e) => {
        if (readOnly) return;
        if (e.key === 'Enter') {
          handleNameUpdate();
        }
      },
    });

    const handleNameUpdate = () => {
      if (readOnly) return;
      onUpdateName?.(newName);
      setEditing(false);
    };

    return (
      <li
        className={classNames(
          styles.Wrapper,
          clone && styles.clone,
          ghost && styles.ghost,
          indicator && styles.indicator,
          disableSelection && styles.disableSelection,
          disableInteraction && styles.disableInteraction,
        )}
        ref={wrapperRef}
        style={
          {
            '--spacing': `${indentationWidth * depth}px`,
          } as React.CSSProperties
        }
        {...props}>
        <div ref={ref} style={style} className='TreeItem'>
          <Stack
            direction='row'
            spacing={1}
            sx={selected ? selectedStyle : {}}
            justifyContent='flex-start'
            alignItems='center'
            {...(!dragHandle && handleProps)}>
            {dragHandle && (
              <div {...handleProps} className='draggable'>
                <Stack
                  justifyContent='center'
                  alignItems='center'
                  sx={{
                    width: '100%',
                    height: '100%',
                    color: 'background.default',
                    ...dragHandleStyle,
                  }}>
                  <DragHandleIcon sx={{ color: 'inherit' }} />
                </Stack>
              </div>
            )}

            <Stack direction='row' spacing={1} alignItems='center' width='100%'>
              {!leaf && !!dirIcon && dirIcon}

              {editing ? (
                <ClickAwayListener onClickAway={handleNameUpdate}>
                  <input
                    ref={editInputRef}
                    style={{
                      width: '100%',
                      color: 'white',
                      backgroundColor: 'rgba(255,255,255, 0)',
                    }}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </ClickAwayListener>
              ) : (
                <Text
                  sx={{ fontSize: '0.85rem', ...hoveredStyle }}
                  variant='subtitle1'
                  onClick={selected && !readOnly ? () => setEditing(true) : onSelect}
                  className='clickable'>{`${value} ${
                  clone && childCount && childCount > 1 ? `+ ${childCount}` : ''
                }`}</Text>
              )}
            </Stack>

            {!!onCollapse && (
              <IconButton onClick={handleCollapse} sx={{ opacity: 0.5 }} size='small'>
                {collapsed ? (
                  <ExpandMoreIcon sx={{ color: 'inherit' }} fontSize='small' />
                ) : (
                  <ExpandLessIcon sx={{ color: 'inherit' }} fontSize='small' />
                )}
              </IconButton>
            )}

            {!clone && !!onRemove && (
              <IconButton onClick={onRemove} sx={{ opacity: 0.5 }} size='small'>
                <CloseIcon sx={{ color: 'inherit' }} fontSize='small' />
              </IconButton>
            )}
          </Stack>
        </div>
      </li>
    );
  },
);
