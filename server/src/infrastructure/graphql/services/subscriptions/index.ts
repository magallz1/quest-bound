import { pubsub } from '../pubsub';

export enum StreamSubscriptionType {
  streamComponents = 'streamComponents',
  streamCharacter = 'streamCharacter',
}

export const subscriptionResolvers = {
  streamCharacter: {
    subscribe: async (_parent: any, _args: any, context: any) => {
      return pubsub.asyncIterator([`${StreamSubscriptionType.streamCharacter}_${_args.id}`], {
        pattern: false,
      });
    },
  },
  streamComponents: {
    subscribe: async (_parent: any, _args: any, context: any) => {
      const { rulesetId, sheetId, tabId } = _args.input;

      return pubsub.asyncIterator(
        [`${StreamSubscriptionType.streamComponents}_${rulesetId}_${sheetId}_${tabId}`],
        { pattern: false },
      );
    },
  },
};
