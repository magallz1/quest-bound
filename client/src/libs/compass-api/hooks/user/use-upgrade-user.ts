import { NotificationPriority, useNotifications } from '@/stores';
import axios from 'axios';
import { useContext, useState } from 'react';
import { RestContext } from '../../provider';
import { useCurrentUser } from './use-current-user';

export const useUpgradeUser = () => {
  const { currentUser } = useCurrentUser();
  const { addNotification } = useNotifications();
  const { checkoutEndpoint, signupEndpoint, manageEndpoint } = useContext(RestContext);
  const [loading, setLoading] = useState<boolean>(false);

  const signupUser = async (email: string) => {
    try {
      setLoading(true);

      await axios.post(signupEndpoint, { email: email.toLowerCase() });

      return 'success';
    } catch (e: any) {
      addNotification({
        message: 'Error creating user',
        status: e.message.includes('409') ? 'info' : 'error',
        priority: NotificationPriority.LOW,
      });
    } finally {
      setLoading(false);
    }
  };

  const upgradeUser = async (isAnnual = false) => {
    if (!currentUser) return;
    try {
      setLoading(true);

      const res = await axios.post(checkoutEndpoint, {
        email: currentUser.email,
        isAnnual,
      });

      return res.data?.url ?? null;
    } catch (e: any) {
      addNotification({
        message: 'Error upgrading user',
        status: e.message.includes('409') ? 'info' : 'error',
        priority: NotificationPriority.LOW,
      });
    } finally {
      setLoading(false);
    }
  };

  const manageUser = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);

      const res = await axios.post(manageEndpoint, {
        email: currentUser.email,
      });

      return res.data?.url ?? null;
    } catch (e: any) {
      addNotification({
        message: 'Error upgrading user',
        status: e.message.includes('409') ? 'info' : 'error',
        priority: NotificationPriority.LOW,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    signupUser,
    upgradeUser,
    manageUser,
    loading,
  };
};
