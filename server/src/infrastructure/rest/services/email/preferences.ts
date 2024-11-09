import axios from 'axios';
import { SUBSCRIBERS_LIST_ID } from './constants';
import { RestfulResponse } from '../../types';
import { RestfulAuthContext } from '@/infrastructure/types';
import { getEmailListMember } from './utils';

type UpdateEmailPreferencesRequest = {
  ignoreUpdates: boolean;
};

/**
 * Set automated email preferences for user within EmailOctopus
 */
export const setEmailPreferences = async (
  request: UpdateEmailPreferencesRequest,
  context: RestfulAuthContext,
): Promise<RestfulResponse> => {
  const apiKey = process.env.EMAIL_OCTOPUS_API_KEY;

  if (!request) {
    return {
      body: JSON.stringify({
        message: 'Request body is required',
      }),
      statusCode: 400,
    };
  }

  const { email } = context;
  const { ignoreUpdates: providedIgnore } = request;

  const ignoreUpdates = providedIgnore ?? false;

  // Adds or removes the ignore-updates tag based on provided preference
  const setIgnoreUpdates = async (memberId: string, ignoreUpdates: boolean) => {
    const res = await axios.put(
      `https://emailoctopus.com/api/1.6/lists/${SUBSCRIBERS_LIST_ID}/contacts/${memberId}`,
      {
        api_key: apiKey,
        email_address: email.toLowerCase(),
        tags: {
          'ignore-updates': ignoreUpdates,
        },
      },
    );

    return res;
  };

  try {
    const list = await getEmailListMember(email);

    const existingMember = list.find((l) => l.email === email.toLowerCase());

    if (!existingMember) {
      return {
        body: JSON.stringify({ message: 'Member not found' }),
        statusCode: 404,
      };
    }

    await setIgnoreUpdates(existingMember.memberId, ignoreUpdates);

    return {
      body: JSON.stringify({ message: 'success' }),
      statusCode: 200,
    };
  } catch (e: any) {
    return {
      body: JSON.stringify({
        message: e.message,
      }),
      statusCode: 400,
    };
  }
};
