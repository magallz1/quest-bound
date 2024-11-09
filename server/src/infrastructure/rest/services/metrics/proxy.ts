import axios from 'axios';

/**
 * Proxies metrics call to Sentry
 */
export const metricsProxy = async (body: any) => {
  const projectId = process.env.SENTRY_PROJECT_ID;
  const sentryHost = process.env.SENTRY_HOST;

  if (!projectId || !sentryHost) {
    return {
      body: JSON.stringify({
        message: 'Missing sentry env',
      }),
      statusCode: 400,
    };
  }

  if (!body) {
    return {
      body: JSON.stringify({
        message: 'No body',
      }),
      statusCode: 400,
    };
  }

  try {
    const res = await axios.post(
      `https://${sentryHost}.ingest.sentry.io/api/${projectId}/envelope/`,
      body,
      {
        headers: {
          'Content-Type': 'application/x-sentry-envelope',
        },
      },
    );

    return {
      body: JSON.stringify({
        data: res.data,
      }),
      statusCode: 200,
    };
  } catch (e: any) {
    return {
      body: JSON.stringify(e),
      statusCode: 400,
    };
  }
};
