import { Image, useCurrentUser, useUpdateCurrentUser } from '@/libs/compass-api';
import { ImageWithUpload } from '@/libs/compass-core-composites';
import { CSSProperties } from 'react';

interface Props {
  containerStyle?: CSSProperties;
  imageStyle?: CSSProperties;
}

export const UploadAvatar = ({ containerStyle, imageStyle }: Props) => {
  const { currentUser } = useCurrentUser();
  const { updateCurrentUser, loading } = useUpdateCurrentUser();

  const handleSetAvatar = (image: Image | null) => {
    updateCurrentUser({
      input: {
        avatarId: image?.id ?? null,
      },
    });
  };

  return (
    <ImageWithUpload
      src={currentUser?.avatarSrc}
      loading={loading}
      onSelect={handleSetAvatar}
      onRemove={() => handleSetAvatar(null)}
      containerStyle={{ width: 150, ...containerStyle }}
      imageStyle={{ height: '150px', width: '150px', ...imageStyle }}
    />
  );
};
