import { currentUser } from './current-user';
import { earlyAccessUser } from './early-access-user';
import { searchUsers } from './search-users';
import { updateCurrentUser } from './update-current-user';

export const userResolvers = {
  Query: {
    currentUser,
    earlyAccessUser,
    searchUsers,
  },
  Mutation: {
    updateCurrentUser,
  },
};
