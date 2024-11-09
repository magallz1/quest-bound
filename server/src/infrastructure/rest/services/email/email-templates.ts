export const sharedRuleset = ({
  username,
  rulesetTitle,
}: {
  username: string;
  rulesetTitle?: string;
}) => `
    <h3>${username} has shared ${rulesetTitle ?? 'a ruleset'} with you.</h3>
    <p><a href="https://questbound.com" target="_blank">Login</a> to add the ruleset to your shelf.</p>
`;
