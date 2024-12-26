/*
  These types represent a partial implementation of the Supabase client API. The live version of Quest Bound used Supabase for file storage and 
  its DB (though most of the DB interactions are handled through GraphQL). 

  Overwriting the client here allows a simple entry point to swap out the DB and file storage for a different provider. To use Supbase, import
  the Supabase createClient function and use it to create a client instance.
*/

type LocalStorageFileApi = {
  download: (fileKey: string) => Promise<{ data: Blob; error?: Error }>;
  remove: (fileKeys: string[]) => Promise<{ data: Blob; error?: Error }>;
  copy: (
    fileKey: string,
    newKey: string
  ) => Promise<{ data: Blob; error?: Error }>;
  createSignedUrl: (
    fileKey: string,
    expiresIn: number
  ) => Promise<{ data: { signedUrl?: string }; error?: Error }>;
};

export type LocalSupabaseClient = {
  storage: {
    from: (table: string) => LocalStorageFileApi;
  };
};
