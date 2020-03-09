import { doRequest } from './do-request.js';

export const getMusicData = async (token) => {
  const limits = {
    longTerm: 5,
    mediumTerm: 10,
    shortTerm: 20,
  };

  // fetch all-time top 20 artist (long_term) <-- big trees labeled
  const topLongTermResponse = await doRequest(`https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=${limits.longTerm}&offset=0`);
  if( !topLongTermResponse ) {
    return false;
  }

  const topLongTerm = topLongTermResponse.items
    .map(( i ) => ({ name: i.name, genre: i.genres[0] }))
    .filter(( i ) => !!i.genre); // some sound track artist have no genre in spotify, e.g.: "Andy Hull and Robert McDowell" (Swiss Army Man OST)

  const topLongTermNames = topLongTerm.map(( i ) => i.name);

  // fetch basic top 20 artist ever (medium_term) minus long terms <-- medium trees
  const topMediumTermResponse = await doRequest(`https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=${limits.mediumTerm}&offset=0`);
  if( !topMediumTermResponse ) {
    return false;
  }

  const topMediumTerm = topMediumTermResponse.items
    .map(( i ) => ({ name: i.name, genre: i.genres[0] }))
    .filter(( i ) => !!i.genre )
    .filter(( i ) => !topLongTermNames.includes( i.name ));

  const topMediumTermNames = topMediumTerm.map(( i ) => i.name );

  // fetch new top 20 artist (short_term) minus medium_term and long_term <-- small trees
  const topShortTermResponse = await doRequest(`https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=${limits.shortTerm}&offset=0`);
  if( !topShortTermResponse ) {
    return false;
  }

  const topShortTerm = topShortTermResponse.items
    .map(( i ) => ({ name: i.name, genre: i.genres[0] }))
    .filter(( i ) => !!i.genre )
    .filter(( i ) => (!topLongTermNames.includes( i.name ) && !topMediumTermNames.includes( i.name )));

  // fetch genre of each artist and map with every noise (bottom organic, top electronic, left atmospheric, right bouncier) <-- horizontal position, branching angles, flower types
  // [atmospheric = left, bouncier = right, organic = round angles, electronic = symmetric angles]
  var genreMap = await (await fetch('assets/genreMap.json')).json();
  [
    ...topLongTerm,
    ...topMediumTerm,
    ...topShortTerm,
  ].map(( artist ) => {
    if( !genreMap[ artist.genre ] ) {
      console.warn('genre ', artist.genre, ' of artist ', artist.name, ' is missing in genre map!');
    }
    artist.electric = ( genreMap[ artist.genre ] || {} ).electric || 0;
    artist.atmospheric = ( genreMap[ artist.genre ] || {} ).atmospheric || 0;
  });

  // get top genre
  const genreCounter = [ ...topLongTerm, ...topMediumTerm, ...topShortTerm ]
    .map(( artist )  => artist.genre )
    .reduce(( counter, genre ) => ({ ...counter, [genre]: (( counter[genre] || 0 ) + 1 )}), {});
  const topGenre = (Object.keys(genreCounter))
    .map(( key ) => ({ name: key, counter: genreCounter[key] }))
    .sort(( g1, g2 ) => ( g1.count > g2.count ))
    [0].name;

  console.log(topGenre)

  const musicData = {
    topLongTerm,
    topMediumTerm,
    topShortTerm,
    genreCounter,
    topGenre,
  };
  


  // fetch 50 songs in last 4 weeks (short_term) <-- branch and flower probability of tree
  // no songs: 0.3 branches, 0 flowers
  // one song: 0.5 branches

  // not top artist but played <-- grass

  return musicData;
};