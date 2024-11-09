import { Image, useImages } from '@/libs/compass-api';
import { Avatar, Badge, IconButton, Skeleton } from '@/libs/compass-core-ui';
import { Image as ImageIcon } from '@mui/icons-material';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { CSSProperties, ReactNode, useState } from 'react';
import { SelectImageModal } from './select-image-modal';

interface ImageWithUploadProps {
  disableUpload?: boolean;
  onSelect?: (image: Image) => void;
  onRemove: () => void;
  src?: string | null;
  alt?: string;
  variant?: 'circular' | 'square' | 'rounded';
  containerStyle?: CSSProperties;
  imageStyle?: CSSProperties;
  onClick?: () => void;
  className?: string;
  id?: string;
  hideMenu?: boolean;
  loading?: boolean;
  children?: ReactNode;
}

export const ImageWithUpload = ({
  src,
  alt,
  disableUpload = false,
  onRemove,
  onSelect,
  onClick,
  loading,
  variant = 'rounded',
  imageStyle,
  containerStyle,
  className,
  id,
  hideMenu,
  children,
  ...events
}: ImageWithUploadProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [creatingFromUrl, setCreatingFromUrl] = useState<boolean>(false);

  const { createImage } = useImages();

  const handleCreateImageFromUrl = async (url: string) => {
    setCreatingFromUrl(true);

    const name = url.split('/').pop()?.split('#')[0].split('?')[0] ?? 'Image from URL';

    const res = await createImage({
      src: url,
      name,
    });

    setCreatingFromUrl(false);
    onSelect?.(res);
    setOpen(false);
  };

  if (loading || creatingFromUrl) {
    return <Skeleton sx={imageStyle} variant='rounded' />;
  }

  return (
    <>
      {!children ? (
        <Badge
          sx={{ ...containerStyle }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          badgeContent={
            hideMenu || disableUpload ? null : (
              <IconButton
                id='image-upload-menu'
                onClick={() => setOpen(true)}
                sx={{
                  bgcolor: 'primary.main',
                  opacity: 0.5,
                  top: '10px',
                  right: '10px',
                  '&:hover': {
                    opacity: 1,
                    bgcolor: 'info.main',
                  },
                }}>
                <MoreHoriz sx={{ height: 15, width: 15 }} fontSize='small' />
              </IconButton>
            )
          }>
          <Avatar
            id={id}
            className={className}
            onClick={onClick}
            {...events}
            src={src ?? undefined}
            alt={alt}
            // Prevents draggable ghost image
            imgProps={{ draggable: false }}
            sx={imageStyle}
            variant={variant}>
            <ImageIcon />
          </Avatar>
        </Badge>
      ) : (
        <div onClick={() => setOpen(true)} className='clickable'>
          {children}
        </div>
      )}

      <SelectImageModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(image: Image) => {
          onSelect?.(image);
          setOpen(false);
        }}
        onSaveUrl={handleCreateImageFromUrl}
        onRemoveUrl={onRemove}
      />
    </>
  );
};
