import { branch } from './branch.js';
import { grass } from './grass.js';

function shuffle(array) {
  return array;
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(random( currentIndex ));
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const cosinInterpolate = (v1, v2, mu) => 
{
    const mu2 = (1-cos(mu*PI))/2;
   return(v1*(1-mu2)+v2*mu2);
}

const drawTree = (options) => {
  const rc = rough.canvas(document.getElementById('defaultCanvas0'));
  for( let i = 0; i < random(5, 15); i+=1 ) {
    const randomX = random(-30, 30);
    const randomY = random(-10, 10);
    rc.line(
      randomX,
      randomY, 
      randomX, 
      randomY+10, 
      {
        roughness: 2,
      },
    );
  };
  branch({
    lenRand: 0.001 * (1- options.organic) + 0.01 * options.organic,
    rotRand: 0.1,
    rot: PI*0.5 * (1- options.organic) + PI*0.3 * options.organic,
    level: 1,
    maxLevel: 8,
    branchProb: 0.6,
    leafProb: 1,
    ...options,
  });
};

const drawBigTree = (options) => (
  drawTree({
    size: options.height/2,
    initalLength: random(options.height * 0.4, options.height * 0.45),
    ...options,
  })  
);

const drawMediumTree = (options) => (
  drawTree({
    size: options.height/4,
    initalLength: random(options.height * 0.2, options.height * 0.3),
    ...options,
  })  
);

const drawSmallTree = (options) => (
  drawTree({
    size: options.height/5,
    initalLength: random(options.height * 0.1, options.height * 0.2),
    ...options,
  })  
);

export const grow = ({ musicData }) => {
  push();
  grass();
  translate(width / 2, height - height/4);
	scale(1, -1);
  
  const { favArtists, recentTracks } = musicData;
  const treesInRow = 3;
  const rows = Math.round(favArtists.length / treesInRow);
  const depth = height * 0.2;

  randomSeed(0);
  const shuffledArtists = shuffle(favArtists);

  shuffledArtists.forEach(( artist, index ) => {
    const seed = artist.name.hashCode();
    randomSeed(seed);

    const wasPlayed = !!recentTracks.find(e => (e.artist === artist.name));
    const organic = (1 - artist.electric);
    const atmo = artist.atmospheric;

    push();
    const curRow = rows - Math.round(index / treesInRow);
    const xoff = depth * (curRow / rows); 
    
    translate(
      (width * atmo) - (width/2) + xoff,
      (curRow / rows) * depth
    );  
    
    stroke(0,0,0);
    rotate(random(-0.1, 0.1));

    const options = {
      seed,
      organic,
      height: height/2,
      colored: wasPlayed,
      leafProb: wasPlayed ? 0.4 : 0.1,
    };

    switch( artist.category ) {
      case 'long_term':
        drawBigTree(options);
        break;
      case 'medium_term':
        drawMediumTree(options);
        break;
      case 'short_term':
      default:
        drawSmallTree(options);
        break;
    }
    pop();
  });
  
  pop()
};