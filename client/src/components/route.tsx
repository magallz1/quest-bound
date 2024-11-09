import { useDeviceSize } from '@/libs/compass-core-ui';
import { EnvContext } from '@/libs/compass-web-utils';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { ReactNode, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

interface FeatureRouteProps {
  children: ReactNode;
  env?: string;
}

export const FeatureRoute = ({ children, env }: FeatureRouteProps) => {
  const { environment } = useContext(EnvContext);
  if (env && environment !== env) return null;
  return <>{children}</>;
};

type ProptectedRouteProps = {
  creator?: boolean;
  blockMobile?: boolean;
  blockTablet?: boolean;
  children?: ReactNode;
};

export const ProtectedRoute = ({
  children,
  creator,
  blockMobile,
  blockTablet,
}: ProptectedRouteProps) => {
  const { mobile, tablet } = useDeviceSize();
  const navigate = useNavigate();

  if ((mobile && blockMobile) || (blockTablet && (tablet || mobile))) {
    return (
      <>
        <Modal isOpen onClose={() => {}} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Device Not Supported</ModalHeader>
            <ModalBody>
              <Stack spacing={4}>
                <Text>
                  This feature is not currently supported on a device this size. Please use a
                  desktop browser to access this feature.
                </Text>

                <Button onClick={() => navigate('/', { replace: true })}>Back</Button>
              </Stack>
            </ModalBody>
          </ModalContent>
        </Modal>
        {children}
      </>
    );
  }

  return <>{children}</>;
};
