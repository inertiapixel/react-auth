import { OAuthProvider } from "../../types";

export type OAuthProviderConfig = {
  authEndpoint: string;
  clientId: string;
  scope: string;
  extras?: Record<string, string>;
};

export const OAUTH_PROVIDERS: Record<OAuthProvider, OAuthProviderConfig> = {
  google: {
    authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    scope: 'openid email profile',
    extras: {
      access_type: 'offline',
      prompt: 'consent',
    },
  },
  facebook: {
    authEndpoint: 'https://www.facebook.com/v10.0/dialog/oauth',
    clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID!,
    scope: 'email public_profile',
    // no extras
  },
  github: {
    authEndpoint: 'https://github.com/login/oauth/authorize',
    clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
    scope: 'read:user user:email',
    // no extras
  },
};
