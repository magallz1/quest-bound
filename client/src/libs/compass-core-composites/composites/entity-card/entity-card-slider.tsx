import { Image, TemplateType } from '@/libs/compass-api';
import { Skeleton, Stack, Text, useDeviceSize } from '@/libs/compass-core-ui';
import React, { CSSProperties, ReactNode } from 'react';
import { EntityCard } from './entity-card';

export type Entity = {
  id: string;
  title?: string;
  name?: string;
  image?: Image | null;
  icon?: React.ReactNode;
  subtitle?: React.ReactNode;
  isModule?: boolean;
  templateType?: TemplateType | null;
  createdBy?: string;
};

interface EntityCardSliderProps {
  entities: Entity[];
  title?: string;
  onClick?: (entity: Entity) => void;
  actions?: ReactNode;
  emptyState: ReactNode;
  selectedId?: string;
  style?: CSSProperties;
  containerStyle?: CSSProperties;
  animate?: boolean;
  loading?: boolean;
}

export const EntityCardSlider = ({
  onClick,
  entities,
  actions,
  title,
  emptyState,
  selectedId,
  style,
  containerStyle,
  animate = true,
  loading = false,
}: EntityCardSliderProps) => {
  const { tablet, desktop, mobile } = useDeviceSize();

  const defaultStyle: CSSProperties = {
    height: 330,
    // maxWidth: mobile ? '100vw' : 680,
    // maxHeight: tablet ? '70vh' : desktop ? '80vh' : '35vh',
    flexWrap: 'wrap',
    overflowY: 'auto',
  };

  return (
    <Stack spacing={4} sx={{ flexGrow: 1, ...containerStyle }}>
      {(!!title || !!actions) && (
        <Stack spacing={1}>
          <Text variant='h4'>{title}</Text>
          {actions}
        </Stack>
      )}

      <Stack
        direction='row'
        gap={3}
        p={2}
        justifyContent={desktop ? 'flex-start' : 'center'}
        sx={{ ...defaultStyle, ...style }}>
        {loading ? (
          <Skeleton
            variant='rectangular'
            sx={{ height: '210px', width: mobile ? '220px' : '280px' }}
          />
        ) : entities.length === 0 ? (
          emptyState
        ) : (
          entities.map((entity) => (
            <EntityCard
              key={entity.id}
              selected={selectedId === entity.id}
              animate={desktop && animate}
              onClick={() => onClick?.(entity)}
              title={entity?.title ?? entity?.name ?? ''}
              image={entity.image}
              subtitle={entity.subtitle ?? entity.createdBy}
            />
          ))
        )}
      </Stack>
    </Stack>
  );
};
