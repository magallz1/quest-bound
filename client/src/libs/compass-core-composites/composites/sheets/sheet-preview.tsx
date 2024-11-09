import {
  Image,
  Sheet,
  SheetType,
  useCurrentUser,
  useSheetTemplates,
  useUpdateSheet,
} from '@/libs/compass-api';
import { Skeleton, Stack, Text, useDeviceSize } from '@/libs/compass-core-ui';
import { ImageWithUpload } from '../image-gallery';

interface SheetPreviewProps {
  sheetId: string;
  sheet?: Sheet;
}

export const SheetPreview = ({ sheetId, sheet: providedSheet }: SheetPreviewProps) => {
  const { mobile } = useDeviceSize();
  const { currentUser } = useCurrentUser();
  const { sheets, loading } = useSheetTemplates();
  const { updateSheet } = useUpdateSheet();

  // This is prefered over useSheet because the latter will fetch components.
  // Sheet details should already be cached if this component is being rendered.
  const sheet = providedSheet ?? sheets?.find((s) => s.id === sheetId);

  const setImage = async (image: Image | null) => {
    if (!sheet) return;
    await updateSheet({
      input: {
        id: sheet.id,
        imageId: image?.id ?? null,
      },
    });
  };

  if (loading) {
    return (
      <Stack width={mobile ? '270px' : '400px'} alignItems='center' spacing={2}>
        <Skeleton height={250} width={250} />
        <Skeleton height={40} width={120} variant='text' />
      </Stack>
    );
  }

  if (!sheet) return null;

  return (
    <Stack width={mobile ? '270px' : '400px'} alignItems='center' spacing={2}>
      <ImageWithUpload
        disableUpload={sheet.userId !== currentUser?.id}
        src={sheet.image?.src ?? ''}
        onSelect={setImage}
        imageStyle={{
          minHeight: 250,
          minWidth: 250,
        }}
        onRemove={() => setImage(null)}
      />

      <Stack spacing={1} width='100%' alignItems='center'>
        <Text variant='h5'>{sheet.title}</Text>
        {sheet.type === SheetType.TEMPLATE && !!sheet.username && (
          <Text variant='subtitle2' sx={{ fontStyle: 'italic' }}>{`By ${sheet.username}`}</Text>
        )}

        {sheet.type === SheetType.SHEET && !!sheet.templateName && (
          <Text variant='subtitle2' sx={{ fontStyle: 'italic' }}>
            {`Created from ${sheet.templateName}`}
          </Text>
        )}
      </Stack>

      <Text sx={{ textAlign: 'center' }}>{sheet.description}</Text>
    </Stack>
  );
};
