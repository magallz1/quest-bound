import axios from 'axios';
import { EmailOctopusResponse, Subscriber } from './types';
import { SUBSCRIBERS_LIST_ID } from './constants';

// Pulls the list of subscribers from EmailOctopus until the email is found or list is fully returned
export const getEmailListMember = async (searchEmail: string) => {
  const apiKey = process.env.EMAIL_OCTOPUS_API_KEY;
  let results: Subscriber[] = [];
  let page = 1;
  let moreResults = true;

  do {
    const res = await axios(
      `https://emailoctopus.com/api/1.6/lists/${SUBSCRIBERS_LIST_ID}/contacts`,
      {
        params: { api_key: apiKey, page },
      },
    );

    const { data } = res;

    results = results.concat(
      (data as EmailOctopusResponse).data.map((subscriber) => ({
        email: subscriber.email_address,
        memberId: subscriber.id,
        free: !!subscriber.tags.find((t) => t === 'free'),
        creator: !!subscriber.tags.find((t) => t === 'creator'),
        ignoreUpdates: !!subscriber.tags.find((t) => t === 'ignore-updates'),
      })),
    );

    const existingMember = results.find((l) => l.email === searchEmail.toLowerCase());

    if (data.paging.next && !existingMember) {
      page++;
    } else {
      moreResults = false;
    }
  } while (moreResults);

  return results;
};
