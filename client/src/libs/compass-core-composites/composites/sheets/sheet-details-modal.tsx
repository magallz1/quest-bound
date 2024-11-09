import { Image, Sheet, useUpdateSheet } from '@/libs/compass-api';
import { Form, FormInput, Modal, Stack, useDeviceSize } from '@/libs/compass-core-ui';
import { useFormik } from 'formik';
import { ImageWithUpload } from '../image-gallery';
import { FormValues, validationSchema } from './form-validation';

interface SheetDetailsProps {
  sheet: Sheet;
  open: boolean;
  onClose: () => void;
}

export const SheetDetailsModal = ({ sheet, open, onClose }: SheetDetailsProps) => {
  const { updateSheet, loading: saveLoading } = useUpdateSheet();
  const { mobile } = useDeviceSize();

  const formik = useFormik<FormValues>({
    initialValues: {
      title: sheet.title,
      description: sheet.description,
    },
    validationSchema,
    onSubmit: (values: FormValues) => {
      handleSave(values);
    },
  });

  const handleSave = async (values: FormValues) => {
    await updateSheet({
      input: {
        id: sheet.id,
        ...values,
      },
    });
    onClose();
  };

  const handleImageSave = async (image: Image | null) => {
    await updateSheet({
      input: {
        id: sheet.id,
        imageId: image?.id ?? null,
      },
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={`Details`}>
      <Form
        loading={saveLoading}
        formik={formik}
        direction='row'
        style={{
          gap: '8px',
          flexWrap: 'wrap',
          maxWidth: '500px',
          padding: 0,
          alignItems: 'flex-start',
        }}
        actions={[
          {
            label: 'Cancel',
            onClick: onClose,
          },
          {
            label: 'Save',
            isSubmit: true,
          },
        ]}>
        <ImageWithUpload
          loading={saveLoading}
          src={sheet.image?.src ?? ''}
          onSelect={handleImageSave}
          onRemove={() => handleImageSave(null)}
          imageStyle={{ width: '150px', height: '150px' }}
        />

        <Stack spacing={4} width={300} sx={{ marginTop: mobile ? '16px' : '0px' }}>
          <FormInput
            label='Sheet Title'
            id='title'
            ignoreHelperText
            sx={{ marginTop: mobile ? '16px' : '0px' }}
          />
          <FormInput label='Description' multiline minRows={4} />
        </Stack>
      </Form>
    </Modal>
  );
};
