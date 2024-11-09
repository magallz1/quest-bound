import { Attribute, AttributeType, SheetTab } from '@/libs/compass-api';
import { AttributeLookup } from '@/libs/compass-core-composites';
import { Confirm } from '@/libs/compass-core-ui';
import {
  Checkbox,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { ArrowDropDown, ContentCopy, Delete } from '@mui/icons-material';
import { useState } from 'react';
import { UpdateTabProps } from './use-edit-tabs';

interface TabItemProps {
  tab: SheetTab;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  updateTab?: (update: UpdateTabProps) => void;
  removeTab: (tabId: string) => void;
  duplicateTab: (tabId: string) => void;
  readOnly?: boolean;
  onRelease?: () => void;
  disableDelete?: boolean;
}

export const TabItem = ({
  tab,
  activeTab,
  setActiveTab,
  updateTab,
  removeTab,
  duplicateTab,
  readOnly = false,
  onRelease,
  disableDelete,
}: TabItemProps) => {
  const [confirm, setConfirm] = useState<boolean>(false);
  const isActive = tab.tabId === activeTab;

  const [inverseCondition, setInverseCondition] = useState<boolean>(
    tab.conditionalRenderInverse ?? false,
  );

  const handleDeleteTab = () => {
    removeTab(tab.tabId);
    setConfirm(false);
  };

  const handleDuplicate = () => {
    duplicateTab(tab.tabId);
  };

  const handleAssign = (attribute: Attribute | null) => {
    updateTab?.({
      id: tab.tabId,
      conditionalRenderAttributeId: attribute?.id ?? null,
    });
  };

  const handleInverse = (renderIfFalse: boolean) => {
    setInverseCondition(renderIfFalse);
    updateTab?.({
      id: tab.tabId,
      conditionalRenderInverse: renderIfFalse,
    });
  };

  return (
    <>
      <Stack
        sx={{ pl: 1, pr: 1 }}
        direction='row'
        height='100%'
        align='center'
        justify='center'
        spacing={1}
        onMouseUp={onRelease}
        onClick={() => setActiveTab(tab.tabId)}
        className='clickable'>
        <Text
          sx={{
            textWrap: 'nowrap',
            fontSize: '0.9rem',
            color: isActive ? '#E66A3C' : 'inherit',
          }}>
          {tab.title}
        </Text>
        {!readOnly && (
          <Popover>
            <PopoverTrigger>
              <IconButton
                size='small'
                aria-label='Edit Tab'
                onClick={(e) => e.stopPropagation()}
                sx={{ color: isActive ? '#E66A3C' : 'inherit' }}>
                <ArrowDropDown fontSize='small' />
              </IconButton>
            </PopoverTrigger>
            <PopoverContent>
              <Stack
                minWidth={100}
                justifyContent='space-between'
                alignItems='center'
                padding={2}
                spacing={4}>
                <Editable
                  defaultValue={tab.title}
                  onSubmit={(title) => updateTab?.({ id: tab.tabId, title })}>
                  <EditablePreview />
                  <EditableInput />
                </Editable>

                <Stack direction='row' spacing={4}>
                  <Tooltip label='Delete'>
                    <IconButton
                      aria-label='Delete'
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirm(true);
                      }}
                      isDisabled={disableDelete}>
                      <Delete fontSize='small' />
                    </IconButton>
                  </Tooltip>

                  <Tooltip label='Duplicate'>
                    <IconButton
                      aria-label='Duplicate'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate();
                      }}>
                      <ContentCopy fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
              <Stack padding={2} align='center' onClick={(e) => e.stopPropagation()}>
                <Text fontSize='0.9rem'>Conditional Display</Text>
                <AttributeLookup
                  onSelect={handleAssign}
                  attributeId={tab.conditionalRenderAttributeId ?? undefined}
                  filterByType={AttributeType.BOOLEAN}
                />

                <Stack spacing={4} direction='row'>
                  <Text
                    textAlign='center'
                    sx={{
                      opacity: tab.conditionalRenderAttributeId ? 1 : 0.2,
                    }}>{`Display if ${!inverseCondition}`}</Text>
                  <Checkbox
                    isDisabled={!tab.conditionalRenderAttributeId}
                    isChecked={!inverseCondition}
                    onChange={(e) => handleInverse(!e.target.checked)}
                  />
                </Stack>
              </Stack>
            </PopoverContent>
          </Popover>
        )}
      </Stack>

      <Confirm
        open={confirm}
        onClose={() => setConfirm(false)}
        title={`Delete ${tab.title}?`}
        onConfirm={handleDeleteTab}>
        <Text>This will delete all components on this page.</Text>
      </Confirm>
    </>
  );
};
