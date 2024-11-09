import { AttributeType } from '@/libs/compass-api';
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Textarea,
  Tooltip,
} from '@chakra-ui/react';
import { Upgrade } from '@mui/icons-material';
import { useContext, useState } from 'react';
import { useNodeId } from 'reactflow';
import { NodeWrapper } from '../components';
import { LogicContext } from '../provider';
import { LogicalValue, OperationType } from '../types';

export const PrimitiveNode = () => {
  const { updateOperation, getOperation, promoteToAttribute } = useContext(LogicContext);
  const operation = getOperation(useNodeId() ?? '');
  if (!operation) return null;

  const [promoting, setPromoting] = useState(false);
  const [newAttributeTitle, setNewAttributeTitle] = useState('');
  const [newAttributeDefaultValue, setNewAttributeDefaultValue] = useState<LogicalValue>('');
  const [promoteLoading, setPromoteLoading] = useState(false);

  const [value, setValue] = useState<LogicalValue>(operation.value ?? '');

  const handleChange = (value: string | number) => {
    setValue(value);
    updateOperation({
      id: operation.id,
      value,
    });
  };

  const handlePromotion = async () => {
    if (newAttributeTitle === '') return;
    setPromoteLoading(true);

    const type = (() => {
      switch (operation.type) {
        case OperationType.Boolean:
          return AttributeType.BOOLEAN;
        case OperationType.Number:
          return AttributeType.NUMBER;
        default:
          return AttributeType.TEXT;
      }
    })();

    await promoteToAttribute(operation, {
      name: newAttributeTitle,
      defaultValue: `${newAttributeDefaultValue}`,
      type,
    });
    setPromoteLoading(false);
    setPromoting(false);
  };

  const onPromote = () => {
    setNewAttributeTitle('');
    setNewAttributeDefaultValue(operation.value ?? '');
    setPromoting(true);
  };

  return (
    <>
      <NodeWrapper data={operation}>
        <Tooltip placement='left' label='Promote to Attribute'>
          <Upgrade
            fontSize='small'
            role='button'
            onClick={onPromote}
            sx={{ position: 'absolute', left: 5, top: 5 }}
          />
        </Tooltip>

        {operation.type === OperationType.Boolean ? (
          <Checkbox
            isChecked={operation.value === 'true'}
            onChange={(e) => handleChange(e.target.checked ? 'true' : 'false')}
          />
        ) : operation.type === OperationType.Text ? (
          <Textarea
            style={{ width: 200 }}
            className='nodrag'
            size='s'
            value={value}
            onChange={(e) => handleChange(e.target.value)}
          />
        ) : (
          <Input
            style={{ width: 100 }}
            className='nodrag'
            type='number'
            size='s'
            value={value}
            onChange={(e) => handleChange(e.target.value)}
          />
        )}
      </NodeWrapper>
      <Modal isOpen={promoting} onClose={() => setPromoting(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Attribute</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={2}>
              <Input
                autoFocus
                placeholder='Title'
                value={newAttributeTitle}
                isInvalid={newAttributeTitle === ''}
                onChange={(e) => setNewAttributeTitle(e.target.value)}
              />
              {operation.type === OperationType.Boolean ? (
                <Checkbox
                  checked={newAttributeDefaultValue === 'true'}
                  onChange={(e) => setNewAttributeDefaultValue(`${e.target.checked}`)}>
                  Default Value
                </Checkbox>
              ) : (
                <Input
                  placeholder='Default Value'
                  type={operation.type === OperationType.Number ? 'number' : 'text'}
                  value={newAttributeDefaultValue}
                  onChange={(e) => setNewAttributeDefaultValue(e.target.value)}
                />
              )}
              <Button isLoading={promoteLoading} onClick={handlePromotion}>
                Create
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
