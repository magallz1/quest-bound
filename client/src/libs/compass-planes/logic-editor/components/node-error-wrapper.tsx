import {
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
} from '@chakra-ui/react';
import { Error } from '@mui/icons-material';
import { ReactNode, useContext } from 'react';
import { LogicContext } from '../provider';
import { EvaluationError, EvaluationErrorType } from '../types';

function getErrorTitle(error: EvaluationError) {
  switch (error.type) {
    case EvaluationErrorType.Circular:
      return 'Circular Reference Detected';
    case EvaluationErrorType.TypeMismatch:
      return 'Incorrect Input Type';
    case EvaluationErrorType.IncorrectNumberOfArguments:
      return 'Incorrect Number of Arguments';
    default:
      return 'Error';
  }
}

function getErrorBody(error: EvaluationError) {
  switch (error.type) {
    case EvaluationErrorType.Circular:
      return 'This action uses an action that in turn uses this action. This creates a circular reference that cannot be resolved.';
    default:
      return error.message ?? 'An unknown error has been detetected.';
  }
}

export const NodeErrorWrapper = ({
  operationId,
  children,
  manualError,
}: {
  operationId: string;
  children: ReactNode;
  manualError?: EvaluationError;
}) => {
  const { errors } = useContext(LogicContext);

  const operationErrors = errors.filter((error) => error.operationId === operationId);

  if (!operationErrors.length && !manualError) {
    return <>{children}</>;
  }

  const operationError = manualError ?? operationErrors[0];

  return (
    <Stack sx={{ outline: `2px solid #E74323`, outlineOffset: '2px' }}>
      <Popover>
        <PopoverTrigger>
          <IconButton
            sx={{ position: 'absolute', top: -50, right: 0, color: '#E74323' }}
            aria-label={'Open error message'}>
            <Error />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>{getErrorTitle(operationError)}</PopoverHeader>
          <PopoverBody>{operationError.message ?? getErrorBody(operationError)}</PopoverBody>
        </PopoverContent>
      </Popover>
      {children}
    </Stack>
  );
};
