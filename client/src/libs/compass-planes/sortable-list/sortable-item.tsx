import { Paper, Stack } from '@/libs/compass-core-ui';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragIndicator } from '@mui/icons-material';
import { CSSProperties, ReactNode } from 'react';

type ProvidedProps = {
  id: string;
  key: string;
};

interface SortableItemProps {
  children: ReactNode;
  style?: CSSProperties;
}

export function SortableItem({ children, style, ...providedProps }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: (providedProps as ProvidedProps).id,
  });

  const sx = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...style,
  };

  return (
    <Paper elevation={isDragging ? 4 : 0} sx={sx}>
      <Stack ref={setNodeRef} direction='row' spacing={1} alignItems='center'>
        <DragIndicator {...attributes} {...listeners} className='draggable' />
        {children}
      </Stack>
    </Paper>
  );
}
