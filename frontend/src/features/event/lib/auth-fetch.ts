import { GetToken } from '@clerk/types';

export async function authenticatedFetch(url: string, getToken: GetToken, options: RequestInit = {}): Promise<Response> {
  // Ensure getToken is actually a function before calling it
  if (typeof getToken !== 'function') {
    // console.error("Authentication required: getToken function is missing or invalid.", getToken);
    throw new Error("Authentication required: getToken function is missing or invalid.");
  }

  const token = await getToken();

  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  } else {
    // If no token is available, and this is an authenticated endpoint,
    // we should throw an error as all business functions require a token.
    throw new Error("Authentication required: No token available.");
  }
  
  const newOptions: RequestInit = {
    ...options,
    headers,
  };

  const fullUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}${url}`;

  return fetch(fullUrl, newOptions);
}
