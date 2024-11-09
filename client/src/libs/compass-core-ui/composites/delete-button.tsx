import { Button, Text } from '@chakra-ui/react';
import { IconButton } from '@mui/material';
import { CSSProperties, ReactNode, useState } from 'react';
import { Confirm } from './confirm';

interface DeleteButtonProps {
  title: string;
  onDelete: () => void;
  loading?: boolean;
  warning?: string;
  style?: CSSProperties;
  icon?: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
  label?: string;
}

export const DeleteButton = ({
  title,
  onDelete,
  loading,
  warning,
  style,
  icon,
  children,
  label = 'Delete',
  disabled = false,
}: DeleteButtonProps) => {
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const defaultWarning = 'This action cannot be undone';

  return (
    <>
      {icon ? (
        <IconButton disabled={disabled} onClick={() => setConfirmOpen(true)} style={style}>
          {icon}
        </IconButton>
      ) : (
        <Button
          variant='ghost'
          isDisabled={disabled}
          onClick={() => setConfirmOpen(true)}
          style={{ width: 150, height: 40, ...style }}>
          {label}
        </Button>
      )}

      <Confirm
        open={confirmOpen}
        loading={loading}
        onClose={() => setConfirmOpen(false)}
        title={title}
        onConfirm={onDelete}>
        {children ? children : <Text>{warning ?? defaultWarning}</Text>}
      </Confirm>
    </>
  );
};
