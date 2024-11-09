export type EmailOctopusEmailResponse = {
  email_address: string;
  id: string;
  fields: {
    email_address: string;
  };
  tags: string[];
};

export type EmailOctopusResponse = {
  data: EmailOctopusEmailResponse[];
};

export type Subscriber = {
  memberId: string;
  email: string;
  free: boolean;
  creator: boolean;
  ignoreUpdates: boolean;
};
