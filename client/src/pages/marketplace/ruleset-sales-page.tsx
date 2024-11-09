import {
  PermissionType,
  useCurrentUser,
  useRulesetPermittedUsers,
  useRulesetSalesPage,
  useSessionToken,
} from '@/libs/compass-api';
import { Loading, LogoIcon, useDeviceSize } from '@/libs/compass-core-ui';
import { useNotifications } from '@/stores';
import {
  Button,
  Card,
  CardBody,
  Center,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { Explicit, FmdBad, Person, PictureAsPdf } from '@mui/icons-material';
import ImageIcon from '@mui/icons-material/Image';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDetailTypes } from './use-detail-types';

export const RulesetSalesPage = () => {
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();
  const { desktop } = useDeviceSize();
  const { token } = useSessionToken();
  const { publishedRulesetId } = useParams();
  const { addPermittedUser, addPermittedUserLoading } = useRulesetPermittedUsers('', true);

  const [acknowledged, setAcknowledged] = useState(false);

  const { addNotification } = useNotifications();

  const { salesPage, getRulesetSalesPage } = useRulesetSalesPage(publishedRulesetId);

  const imageSrc = salesPage?.images ? salesPage.images[0]?.src ?? '' : '';
  const createdAt = format(new Date(salesPage?.createdAt ?? Date.now()), 'MM/dd/yyyy');

  const detailTypes = useDetailTypes(salesPage);

  const imageWidth = desktop ? '40dvw' : '90dvw';
  const maxImageWidth = desktop ? '450px' : '90dvw';

  const loadedUserPermission = useRef<boolean>(false);
  useEffect(() => {
    // Refetch when user loads in to grab permissions
    if (!loadedUserPermission.current && token && publishedRulesetId) {
      loadedUserPermission.current = true;
      getRulesetSalesPage(publishedRulesetId);
    }
  }, [token, publishedRulesetId]);

  const handleAddToShelf = async () => {
    if (!currentUser || !salesPage) return;
    try {
      await addPermittedUser({
        rulesetId: salesPage.id,
        userId: currentUser.id,
        permission: PermissionType.READ,
      });

      await getRulesetSalesPage(salesPage.id);

      addNotification({
        message: 'This ruleset has been added to your shelf',
        status: 'success',
      });
    } catch (e) {
      addNotification({
        message: 'Failed to add ruleset to shelf',
        status: 'error',
      });
    }
  };

  const goToShelf = () => {
    localStorage.removeItem('last-viewed-ruleset-id');
    navigate('/');
  };

  if (!!publishedRulesetId && !salesPage) {
    return <Loading />;
  }

  if (Boolean(salesPage) && !salesPage.live && !salesPage.currentUserHasPermission) {
    return (
      <main style={{ padding: '16px', height: '100dvh', overflowY: 'auto' }}>
        <Stack spacing={12} align='center' padding={4}>
          <Stack spacing={4} direction='row' align='center' width='100%'>
            <LogoIcon />
            <Text
              sx={{
                fontFamily: 'CygnitoMonoPro',
              }}>
              Quest Bound Marketplace
            </Text>
          </Stack>

          <Heading>This content is not available</Heading>
          <Text textAlign='center'>
            The ruleset you are looking for is not listed. Contact the publisher for inquiries about
            its current availability.
          </Text>
        </Stack>
      </main>
    );
  }

  return (
    <main style={{ padding: '16px', height: '100dvh', overflowY: 'auto' }}>
      <Stack spacing={8}>
        <Stack
          pl={1}
          pr={1}
          direction='row'
          align='center'
          width='100%'
          justifyContent='space-around'>
          <Stack direction='row' spacing={4} align='center' justify='center'>
            <LogoIcon />
            <Text
              sx={{
                fontFamily: 'CygnitoMonoPro',
              }}>
              Quest Bound Marketplace
            </Text>
          </Stack>
          {currentUser && (
            <Tooltip label='Go to your shelf'>
              <Stack direction='row' spacing={4} align='center' role='button' onClick={goToShelf}>
                <Image
                  src={currentUser.avatarSrc ?? ''}
                  width='30px'
                  height='30px'
                  fallback={
                    <Center>
                      <Person />
                    </Center>
                  }
                />
                <Text>{currentUser.username}</Text>
              </Stack>
            </Tooltip>
          )}
        </Stack>

        <Stack direction='row' spacing={8} sx={{ flexWrap: 'wrap' }} justifyContent='center'>
          <Stack spacing={4}>
            <Image
              src={imageSrc}
              style={{
                maxHeight: '500px',
                minWidth: '300px',
                maxWidth: maxImageWidth,
              }}
              fallback={
                <Center
                  sx={{
                    height: 500,
                    minWidth: '300px',
                    maxWidth: maxImageWidth,
                    width: imageWidth,
                    bgColor: '#42403D',
                  }}>
                  <ImageIcon />
                </Center>
              }
            />

            {salesPage.currentUserHasPermission && salesPage.shelved ? (
              <Stack spacing={2}>
                <Text textAlign='center' fontStyle='italic'>
                  Already On Shelf
                </Text>
                <Button onClick={goToShelf}>Go to Shelf</Button>
              </Stack>
            ) : !!currentUser ? (
              <Button isLoading={addPermittedUserLoading} onClick={handleAddToShelf}>
                {salesPage.currentUserHasPermission ? 'Re-add to Shelf' : 'Add to Shelf'}
              </Button>
            ) : (
              <Button onClick={goToShelf}>Sign in to Add to Shelf</Button>
            )}
          </Stack>
          <Stack maxWidth={desktop ? '60dvw' : '90dvw'} spacing={12}>
            <Stack>
              <Heading>{salesPage.title}</Heading>
              <Text>{`Created by ${salesPage.createdBy}`}</Text>
              <Text>Last Updated: {createdAt}</Text>
              {salesPage.includesAI && (
                <Stack direction='row' spacing={2}>
                  <FmdBad />
                  <Text fontSize='0.9rem' fontStyle='italic'>
                    Incorporates AI generated content
                  </Text>
                </Stack>
              )}
              {salesPage.includesPDF && (
                <Stack direction='row' spacing={2}>
                  <PictureAsPdf />
                  <Text fontSize='0.9rem' fontStyle='italic'>
                    Includes a PDF version
                  </Text>
                </Stack>
              )}
              {salesPage.explicit && (
                <Stack direction='row' spacing={2}>
                  <Explicit />
                  <Text fontSize='0.9rem' fontStyle='italic'>
                    Includes explicit content
                  </Text>
                </Stack>
              )}
            </Stack>
            <Stack direction='row' spacing={4} flexWrap='wrap'>
              {detailTypes.map((type) => (
                <Card key={type.title} sx={{ width: '150px', height: '150px' }}>
                  <CardBody>
                    <Stack justifyContent='center' align='center'>
                      <Text fontSize='1.5rem'>{type.title}</Text>
                      {type.icon}
                      <Text>{type.count}</Text>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <Modal isOpen={salesPage.explicit && !acknowledged} onClose={() => {}} isCentered>
        <ModalOverlay sx={{ backdropFilter: 'blur(50px)' }} />
        <ModalContent>
          <ModalHeader>
            <Heading>Explicit Content Warning</Heading>
          </ModalHeader>
          <ModalBody>
            <Text>
              The creator of this content has marked it as explicit. While it might not be reflected
              on this page, it may include explicit or graphic images or text.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setAcknowledged(true)}>I Understand</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </main>
  );
};
