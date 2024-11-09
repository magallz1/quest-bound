import { Close } from '@mui/icons-material';
import { CSSProperties, ReactNode } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from '../components';
import { useDeviceSize } from '../hooks';

export type ModalAction = {
  label: string;
  onClick: () => void;
  isPrimary?: boolean;
  isError?: boolean;
  disabled?: boolean;
};

export interface ModalProps {
  open: boolean;
  title?: string;
  centerTitle?: boolean;
  loading?: boolean;
  children?: ReactNode;
  size?: 'small' | 'medium' | 'large';
  onClose?: () => void;
  actions?: ModalAction[];
  style?: CSSProperties;
}

export const Modal = ({
  open,
  title,
  centerTitle,
  loading = false,
  onClose,
  children,
  size = 'small',
  actions,
  style,
}: ModalProps) => {
  const { mobile } = useDeviceSize();

  const baseStyles = { padding: 2 };

  const modalStyles = {
    small: {
      minWidth: mobile ? '250px' : '300px',
    },
    medium: {
      width: '70vw',
      height: '50vh',
      maxHeight: 740,
      maxWidth: 1200,
    },
    large: {
      padding: 0,
      width: '90vw',
      maxWidth: mobile ? 300 : 1300,
      height: 700,
    },
  };

  return (
    <Dialog open={open} onClose={onClose}>
      {!!title || (mobile && !!onClose) ? (
        <Stack
          direction='row'
          width='100%'
          alignItems='center'
          justifyContent='space-between'
          sx={{ pl: 1, pr: 1 }}>
          {title && (
            <DialogTitle
              sx={{
                textAlign: centerTitle ? 'center' : undefined,
                pl: 1,
                fontSize: '0.9rem',
                opacity: 0.7,
              }}>
              {title}
            </DialogTitle>
          )}
          {mobile && !!onClose && (
            <IconButton onClick={onClose}>
              <Close fontSize='small' />
            </IconButton>
          )}
        </Stack>
      ) : null}

      <DialogContent
        sx={{ ...baseStyles, ...modalStyles[size as keyof typeof modalStyles], ...style }}>
        {children}
      </DialogContent>
      {!!actions && actions.length > 0 && (
        <DialogActions>
          {actions?.map((action, i) => (
            <Button
              key={i}
              onClick={action.onClick}
              loading={action.isPrimary && loading}
              disabled={(!action.isPrimary && loading) || action.disabled}
              variant={action.isPrimary || action.isError ? 'contained' : 'text'}
              color={action.isError ? 'error' : action.isPrimary ? 'secondary' : 'inherit'}
              type={action.isPrimary ? 'submit' : 'button'}>
              {action.label}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
};
