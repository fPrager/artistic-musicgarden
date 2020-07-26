
import { grow } from './garden/grow.js';
import { getMusicData } from './spotify/get-music-data.js';
import { filter } from './filter.js';

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

let shader = 0;

window.setup = function(){
  createCanvas(1280, 1280 * window.innerHeight/window.innerWidth - 10);
};

window.draw = function(){
  noLoop();

  getMusicData()
    .then((data) => {
      if( !data ) return;
      stroke(0, 0, 0);
      background(0, 0, 0, 0);
      const name = `${data.topGenre} garden`;
      textSize(20);
      text(name, width - name.length * 10, height-10);
      grow({
        musicData: data
      });
      
      document.getElementById('spinner').style.display = 'none';
      const finishedMarker = document.createElement('div');
      finishedMarker.id = 'finishedMarker';
      document.body.appendChild(finishedMarker);
      // filter.applyConvolute();
    });
};



