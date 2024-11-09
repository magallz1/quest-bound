import axios from 'axios';
import { SUBSCRIBERS_LIST_ID } from './constants';
import { getEmailListMember } from './utils';

interface SubscribeToEmailListParams {
  email: string;
  formerCreator?: boolean;
}

export const addCreatorTag = async ({ email, formerCreator }: SubscribeToEmailListParams) => {
  const apiKey = process.env.EMAIL_OCTOPUS_API_KEY;

  const updateContact = async (email: string) => {
    const list = await getEmailListMember(email);
    const existingMember = list.find((l) => l.email === email.toLowerCase());

    if (!existingMember) {
      return;
    }

    const res = await axios.put(
      `https://emailoctopus.com/api/1.6/lists/${SUBSCRIBERS_LIST_ID}/contacts/${existingMember.memberId}`,
      {
        api_key: apiKey,
        email_address: email.toLowerCase(),
        tags: {
          creator: formerCreator ? false : true,
          free: formerCreator ? true : false,
          'former-creator': formerCreator,
        },
      },
    );

    return res;
  };

  try {
    await updateContact(email.toLowerCase());

    return {
      body: JSON.stringify({
        message: `Added creator flag to ${email.toLowerCase()}.`,
      }),
      statusCode: 200,
    };
  } catch (e: any) {
    console.log(e);
    return {
      body: JSON.stringify({
        message: `Unknown error: ${e.message}`,
      }),
      statusCode: 500,
    };
  }
};
