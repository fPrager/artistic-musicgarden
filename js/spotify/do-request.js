// use token you requested from spotify console: 
// https://developer.spotify.com/console/get-current-user-top-artists-and-tracks/?type=artists&time_range=medium_term&limit=10&offset=0

export const doRequest = async (url) => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('spotifyToken');

  if( !token ) {
    console.error('Missing \'spotifyToken\' url parameter');
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

  const reader = response.body.getReader();
  const utf8Decoder = new TextDecoder("utf-8");
  let done = false;
  let value = '';
  let result = '';

  while(!done) {
    ({ done, value } = await reader.read());
    if (done) {
      console.log('Stream complete with ');
    };
    const sub = (value ? utf8Decoder.decode(value) : "")
    result += sub;
  };

  return JSON.parse(result);
};