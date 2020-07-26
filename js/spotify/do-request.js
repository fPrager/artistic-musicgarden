// use token you requested from spotify console: 
// https://developer.spotify.com/console/get-current-user-top-artists-and-tracks/?type=artists&time_range=medium_term&limit=10&offset=0

const musicgardenAuthorizationEndpoint = 'https://hx3b7wzfw9.execute-api.eu-central-1.amazonaws.com';
const getRefreshTokenRoute = '/get-refresh-token';
const refreshRoute = '/refresh';

const hash = 
    window.location.search
    .substring(1)
    .split('&')
    .reduce(function (initial, item) {
      if (item) {
        var parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});

let token = hash.access_token;
let code = hash.code;
const implicit = hash.implicit;
let refresh_token = hash.refresh_token;

if( !token && !code && !refresh_token ) {
  const authEndpoint = 'https://accounts.spotify.com/authorize';
  const clientId = '416833a723784b88bb22e60480dee202';
  const redirectUri = 'https://artistic-musicgarden--fprager.repl.co';
  const scopes = [
    'user-top-read',
    'user-read-recently-played',
  ];
  const authorizationFlow = implicit ? 'token' : 'code';

  const url = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=${authorizationFlow}&show_dialog=true`;
  window.location = url;
}

export const doRequest = async (url) => {
  if(!token && !code && !refresh_token) return false;

  if( !token && code ) {
    const getRefreshTokenResponse = await fetch(
      `${musicgardenAuthorizationEndpoint}${getRefreshTokenRoute}`,
      {
        method: 'POST',
        body: JSON.stringify({
            data: {
              code,
            }
        }),
      }
    );

    if( !getRefreshTokenResponse.ok ) {
      console.error('Failed to get refresh token');
      return false;
    }

    ({ refresh_token } = (await getRefreshTokenResponse.json()));

    if( !refresh_token ) {
      console.error('Failed to get refresh token from response');
      return false;
    }

    const permanentAccessRoute = `https://artistic-musicgarden--fprager.repl.co?refresh_token=${refresh_token}`;
    window.location = permanentAccessRoute;
  }

  if( !token && refresh_token ) {
    const tokenResponse = await fetch(
      `${musicgardenAuthorizationEndpoint}${refreshRoute}`,
      {
        method: 'POST',
        body: JSON.stringify({
            data: {
              refresh_token,
            }
        }),
      }
    );
    if( !tokenResponse.ok ) {
      console.error('Failed to get toke from refresh_token');
      return false;
    }

    token = (await tokenResponse.json()).access_token;

    if( !token ) {
      console.error('Failed to get refresh token from response');
      return false;
    }
  }

  if( !token ) {
    console.error('Missing authorization token.');
      return false;
  }

  const response = await fetch(
    url,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

  if( !response.ok ) {
    console.error(`Failed request to ${url}`);
    return false;
  }

  return await response.json();
};