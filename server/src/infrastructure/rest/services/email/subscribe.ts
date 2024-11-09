import axios from 'axios';
import { SUBSCRIBERS_LIST_ID } from './constants';

interface SubscribeToEmailListParams {
  email: string;
  location?: string;
}

export const subscribeToEmailList = async ({ email, location }: SubscribeToEmailListParams) => {
  const apiKey = process.env.EMAIL_OCTOPUS_API_KEY;

  const createContact = async (email: string) => {
    const res = await axios.post(
      `https://emailoctopus.com/api/1.6/lists/${SUBSCRIBERS_LIST_ID}/contacts`,
      {
        api_key: apiKey,
        email_address: email.toLowerCase(),
        fields: {
          Location: location,
        },
        tags: ['ignore-updates', 'free'],
      },
    );
    return res;
  };

  try {
    await createContact(email.toLowerCase());

    return {
      body: JSON.stringify({
        message: `Subscribed ${email.toLowerCase()} to the newsletter.`,
      }),
      statusCode: 200,
    };
  } catch (e: any) {
    // Already on list
    if (e.message === 'Request failed with status code 409') {
      return {
        body: JSON.stringify({
          message: `${email.toLowerCase()} is already subscribed.`,
        }),
        statusCode: 200,
      };
    }

    return {
      body: JSON.stringify({
        message: `Unknown error: ${e.message}`,
      }),
      statusCode: 500,
    };
  }
};
