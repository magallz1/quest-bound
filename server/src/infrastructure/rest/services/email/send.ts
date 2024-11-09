import { RestfulAuthContext } from '@/infrastructure/types';
import { sharedRuleset } from './email-templates';
import { SESv2Client, SendEmailCommand, SendEmailCommandInput } from '@aws-sdk/client-sesv2';

const SES_CONFIG = {
  accessKeyId: process.env.SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
  region: 'us-east-1',
};

const ses = new SESv2Client(SES_CONFIG);

interface SendEmailParams {
  emailTo: string;
  username: string;
  rulesetTitle?: string;
}

export const sendEmail = async (
  { emailTo, username, rulesetTitle }: SendEmailParams,
  context: RestfulAuthContext,
) => {
  try {
    const input: SendEmailCommandInput = {
      FromEmailAddress: 'Quest Bound <curt@questbound.com>',
      Destination: {
        ToAddresses: [emailTo],
      },
      Content: {
        Simple: {
          Subject: {
            Data: `${username} just shared a ruleset with you!`, // required
          },
          Body: {
            Text: {
              Data: `${username} just shared ${
                rulesetTitle ?? 'a ruleset'
              } with you. Login at https://questbound.com to try it out!`, // required
            },
            Html: {
              Data: sharedRuleset({ username, rulesetTitle }),
            },
          },
        },
      },
    };

    const command = new SendEmailCommand(input);
    await ses.send(command);

    return {
      body: JSON.stringify({ message: 'success' }),
      statusCode: 200,
    };
  } catch (e) {
    return {
      body: JSON.stringify(e),
      statusCode: 400,
    };
  }
};
