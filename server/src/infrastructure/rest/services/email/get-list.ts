import axios from 'axios';
import { SUBSCRIBERS_LIST_ID } from './constants';
import { RestfulResponse } from '../../types';
import { EmailOctopusResponse, Subscriber } from './types';

export const getEmailList = async (): Promise<RestfulResponse> => {
  try {
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
          memberId: subscriber.id,
          email: subscriber.email_address,
          free: !!subscriber.tags.find((t) => t === 'free'),
          creator: !!subscriber.tags.find((t) => t === 'creator'),
          ignoreUpdates: !!subscriber.tags.find((t) => t === 'ignore-updates'),
        })),
      );

      if (data.paging.next) {
        page++;
      } else {
        moreResults = false;
      }
    } while (moreResults);

    return {
      body: JSON.stringify(results),
      statusCode: 200,
    };
  } catch (e) {
    return {
      body: JSON.stringify(e),
      statusCode: 400,
    };
  }
};
