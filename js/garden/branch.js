import { p } from '../main.js';

const rand = () => {
	return p.random(1000) / 1000;
}

const rand2 = () => {
	return p.random(2000) / 1000 - 1;
}

export const branch = (
  settings = {}
) => {

  const {
    level, 
    seed, 
    maxLevel = 13,
    size = 200,
    leafProb = 0.5,
    lenRand = 0.5,
    branchProb = 1,
    rotRand = 0.1,
  } = settings;

  const rot = (p.PI/2) / 4;
  const prog = maxLevel+1;

	if ( prog < level )
		return;
	
	p.randomSeed(seed);
	
	const seed1 = p.random(1000),
		seed2 = p.random(1000);
		
	const growthLevel = (prog - level > 1) || (prog >= maxLevel + 1) ? 1 : (prog - level);
	
	p.strokeWeight((12 * Math.pow((maxLevel - level + 1) / maxLevel, 2)) * size/200);

	const len = p.random(1) * (growthLevel * size* (1 + rand2(p) * lenRand));
	
	p.line(0, 0, 0, len / level);
	p.translate(0, len / level);
	
	
	const doBranch1 = rand() < branchProb;
	const doBranch2 = rand() < branchProb || !doBranch1;
	
	var doLeaves = rand() < leafProb;
	
	if ( level < maxLevel )
	{
		
		var r1 = rot * (1 + rand2() * rotRand);
		var r2 = -rot * (1 - rand2() * rotRand);
		
		if ( doBranch1 )
		{
			p.push();
			p.rotate(r1);
			branch({
        ...settings,
        level: level + 1, 
        seed: seed1,
      });
			p.pop();
		}
		if ( doBranch2 )
		{
			p.push();
			p.rotate(r2);
			branch({
        ...settings,
        level: level + 1, 
        seed: seed2,
      });
			p.pop();
		}
	}
	
	if ( (level >= maxLevel || (!doBranch1 && !doBranch2)) && doLeaves )
	{
		const k = Math.min(1, Math.max(0, prog - level));
		
		var flowerSize = (size / 100) * k * (1 / 6) * (len / level);

		p.strokeWeight(1);
    const grey = 150 + 100 * rand2();
		p.stroke(grey);
		
		p.rotate(-p.PI);
		for ( var i=0 ; i<=8 ; i++ )
		{
			p.line(0, 0, 0, flowerSize * (1 + 0.5 * rand2()));
			p.rotate(2 * p.PI/8);
		}
	}	
};