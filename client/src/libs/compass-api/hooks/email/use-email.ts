import { NotificationPriority, useNotifications } from '@/stores';
import axios from 'axios';
import { useContext, useState } from 'react';
import { RestContext } from '../../provider';
import { useCurrentUser, useSessionToken } from '../user';

type ListResponse = {
  email: string;
  access_granted: boolean;
};

export const useEmail = () => {
  const { token } = useSessionToken();
  const { addNotification } = useNotifications();
  const { emailApiEndpoint } = useContext(RestContext);
  const { currentUser } = useCurrentUser();

  const [loading, setLoading] = useState<boolean>(false);

  const getList = async (listName?: string): Promise<ListResponse[]> => {
    let endpoint = `${emailApiEndpoint}/list`;
    if (listName) endpoint += `?listName=${listName}`;

    const res = await axios(endpoint);

    return res.data as ListResponse[];
  };

  const setPreferences = async ({ subscribeToUpdates }: { subscribeToUpdates: boolean }) => {
    if (!currentUser) return;
    try {
      setLoading(true);

      if (subscribeToUpdates) {
        await subscribe({
          email: currentUser.email,
          notify: false,
        });
      }

      const res = await axios.post(
        `${emailApiEndpoint}/preferences`,
        {
          email: currentUser.email,
          userId: currentUser.id,
          ignoreUpdates: !subscribeToUpdates,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res;
    } catch (e) {
      addNotification({
        message: 'Failed to update preferences.',
        priority: NotificationPriority.LOW,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const send = async ({
    emailTo,
    type = 'share',
    rulesetTitle,
    templateTitle,
    rulesetId,
  }: {
    emailTo: string;
    type?: 'share';
    rulesetTitle?: string;
    templateTitle?: string;
    rulesetId?: string;
  }) => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${emailApiEndpoint}/send`,
        {
          emailTo,
          username: currentUser.username,
          userId: currentUser.id,
          rulesetTitle,
          rulesetId,
          templateTitle,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res;
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async ({
    email,
    location,
    alphaRequest = false,
    notify = true,
  }: {
    email: string;
    location?: string;
    alphaRequest?: boolean;
    notify?: boolean;
  }) => {
    try {
      setLoading(true);
      const res = await axios.post(`${emailApiEndpoint}/subscribe`, {
        email,
        alphaRequest,
        location,
      });

      if (res.status === 200 && notify) {
        addNotification({
          message: res.data.message,
          priority: NotificationPriority.LOW,
          status: 'info',
        });
      }

      return res;
    } catch (e) {
      addNotification({
        message: 'Failed to subscribe to list.',
        priority: NotificationPriority.LOW,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    getList,
    setPreferences,
    subscribe,
    send,
    loading,
  };
};
