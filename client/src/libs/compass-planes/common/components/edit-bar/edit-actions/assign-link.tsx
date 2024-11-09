import { ComponentData, Page, UpdateSheetComponent } from '@/libs/compass-api';
import { PageLookup } from '@/libs/compass-core-composites';
import { IconButton, Stack, Tooltip } from '@/libs/compass-core-ui';
import { Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import { Link } from '@mui/icons-material';

interface AssignLinkProps {
  data: ComponentData;
  onChange: (update: Partial<UpdateSheetComponent>) => void;
  disabled?: boolean;
}

export const AssignLink = ({ data, onChange, disabled = false }: AssignLinkProps) => {
  const pageId = data.pageId;

  const handleChange = (pageId: string | null) => {
    onChange({
      data: JSON.stringify({
        ...data,
        pageId,
      }),
    });
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Tooltip title='Insert Link'>
            <IconButton disabled={disabled} sx={{ color: pageId ? 'secondary.main' : 'inherit' }}>
              <Link fontSize='small' />
            </IconButton>
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent>
          <Stack p={2}>
            <PageLookup
              pageId={pageId ?? undefined}
              onSelect={(page: Page | null) => handleChange(page?.id ?? null)}
              defaultUrl={pageId?.includes('http') ? pageId : undefined}
              onEnterUrl={(url: string) => handleChange(url)}
            />
          </Stack>
        </PopoverContent>
      </Popover>
    </>
  );
};
