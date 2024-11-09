import { useCurrentUser, useUpdateCurrentUser } from '@/libs/compass-api';
import { FormControl, FormLabel, Switch, Text } from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';

export const NotificationSettings = () => {
  const { currentUser } = useCurrentUser();
  const { updateCurrentUser } = useUpdateCurrentUser();

  const debouncedUpdate = useMemo(
    () =>
      debounce(updateCurrentUser, 1000, {
        trailing: true,
      }),
    [],
  );

  const [updates, setUpdates] = useState<boolean>(currentUser?.preferences.emailUpdates ?? false);
  const [shares, setShares] = useState<boolean>(currentUser?.preferences.emailShares ?? false);
  const [unsubscribe, setUnsubscribe] = useState<boolean>(
    currentUser?.preferences.emailUnsubscribe ?? false,
  );

  useEffect(() => {
    if (!currentUser) return;
    const { preferences } = currentUser;
    setUpdates(preferences.emailUpdates);
    setShares(preferences.emailShares);
    setUnsubscribe(preferences.emailUnsubscribe);
  }, [currentUser]);

  const handleChange = (preference: 'updates' | 'shares' | 'unsubscribe', checked: boolean) => {
    switch (preference) {
      case 'updates':
        setUpdates(checked);
        break;
      case 'shares':
        setShares(checked);
        break;
      case 'unsubscribe':
        setUnsubscribe(checked);
        break;
    }

    debouncedUpdate({
      input: {
        preferences: {
          emailUpdates: preference === 'updates' ? checked : updates,
          emailShares: preference === 'shares' ? checked : shares,
          emailUnsubscribe: preference === 'unsubscribe' ? checked : unsubscribe,
        },
      },
    });
  };

  return (
    <>
      <Text>Email Notifications</Text>

      <FormControl display='flex' alignItems='center'>
        <FormLabel htmlFor='updates' mb='0'>
          Updates
        </FormLabel>
        <Switch
          id='updates'
          isDisabled={unsubscribe}
          isChecked={updates}
          onChange={(e) => handleChange('updates', e.target.checked)}
        />
      </FormControl>
      <FormControl display='flex' alignItems='center'>
        <FormLabel htmlFor='shares' mb='0'>
          When content is shared with you
        </FormLabel>
        <Switch
          id='shares'
          isDisabled={unsubscribe}
          isChecked={shares}
          onChange={(e) => handleChange('shares', e.target.checked)}
        />
      </FormControl>
      <FormControl display='flex' alignItems='center'>
        <FormLabel htmlFor='unsubscribe' mb='0'>
          Only send essential emails
        </FormLabel>
        <Switch
          id='unsubscribe'
          isChecked={unsubscribe}
          onChange={(e) => handleChange('unsubscribe', e.target.checked)}
        />
      </FormControl>
    </>
  );
};
