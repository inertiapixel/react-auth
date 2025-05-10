import { OAUTH_PROVIDERS } from './providers';
import { SocialAuthPayload } from '../../types';
import { API_BASE_URL } from '../config';

export const socialLogin = ({ provider }: SocialAuthPayload): void => {
  const config = OAUTH_PROVIDERS[provider];

  if (!config) {
    throw new Error(`Unsupported OAuth provider: ${provider}`);
  }

  const params: Record<string, string> = {
    client_id: config.clientId,
    redirect_uri: `${API_BASE_URL}/auth/callback?provider=${provider}`,
    response_type: 'code',
    scope: config.scope,
    ...(config.extras || {})
  };

  const queryString = new URLSearchParams(params).toString();
  const authUrl = `${config.authEndpoint}?${queryString}`;

  window.location.href = authUrl;
};
