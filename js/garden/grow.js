import { p } from '../main.js';
import { branch } from './branch.js';
import { makePlant } from './make-plant.js';


export const grow = ({ musicData }) => {
  p.translate(p.width / 2, p.height);
	p.scale(1, -1);
	p.translate(0, 20);

  for(var i=0; i<100; i++) {
    p.push();
    p.translate((p.random(p.width) - p.width/2)/2, 0);
    p.rotate(p.random(0.4) - 0.2);
    branch({
        level: 1, 
        maxLevel: p.random(7) + 7,
        branchProb: Math.random()/2 + 0.5,
        seed: 1000 * p.random(),
        size: p.random(p.height/3),
      });
    p.pop();
  }
  
  
  /*
  const plants = [];
  for( var i=0; i<10; i++ ) 
    plants.push( makePlant(Math.random() * 1000) );

  plants.forEach(p => p.grow());
  */
};