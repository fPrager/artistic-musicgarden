import { rc } from '../rough.js';


function parseValues(args) {
	var numbers = args.match(number)
	return numbers ? numbers.map(Number) : []
}

var length = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0}
var segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig
var number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig

function parse(path) {
	var data = []
	path.replace(segment, function(_, command, args){
		var type = command.toLowerCase()
		args = parseValues(args)
		// overloaded moveTo
		if (type == 'm' && args.length > 2) {
			data.push([command].concat(args.splice(0, 2)))
			type = 'l'
			command = command == 'm' ? 'l' : 'L'
		}
    
		while (true) {
			if (args.length == length[type]) {
				args.unshift(command)
				return data.push(args)
			}
			if (args.length < length[type]) throw new Error('malformed path data')
			data.push([command].concat(args.splice(0, length[type])))
		}
	})
	return data
}

const scalePath = function(segments, sx, sy) {
  console.log(segments);
  sy = (!sy && (sy !== 0)) ? sx : sy

  return segments.map(function(segment) {
    var name  = segment[0].toLowerCase()

    // V & v are the only command, with shifted coords parity
    if (name === 'v') {
      segment[1] *= sy
      return segment
    }

    // ARC is: ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
    // touch rx, ry, x, y only
    if (name === 'a') {
      segment[1] *= sx
      segment[2] *= sy
      segment[6] *= sx
      segment[7] *= sy
      return segment
    }

    // All other commands have [cmd, x1, y1, x2, y2, x3, y3, ...] format
    return segment.map(function(val, i) {
      if (!i) {
        return val
      }
      return val *= i % 2 ? sx : sy
    })
  })
}

function serialize(path){
	return path.reduce(function(str, seg){
		return str + seg[0] + seg.slice(1).join(',')
	}, '')
}

const leafPath = serialize(scalePath(parse('m83.996 0.277c-46.249 0-83.743 37.493-83.743 83.742 0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l0.001-0.004zm38.404 120.78c-1.5 2.46-4.72 3.24-7.18 1.73-19.662-12.01-44.414-14.73-73.564-8.07-2.809 0.64-5.609-1.12-6.249-3.93-0.643-2.81 1.11-5.61 3.926-6.25 31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-0.903-8.148-4.35-1.04-3.453 0.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-0.001zm0.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219-1.254-4.14 1.08-8.513 5.221-9.771 29.581-8.98 78.756-7.245 109.83 11.202 3.73 2.209 4.95 7.016 2.74 10.733-2.2 3.722-7.02 4.949-10.73 2.739z'), 0.1));

const rand = () => {
	return random(1000) / 1000;
}

const rand2 = () => {
	return random(2000) / 1000 - 1;
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
    rot =  (PI/2) / 4,
    rotRand = 0.6,
    initalLength,
    colored,
  } = settings;

  const prog = maxLevel+1;

	if ( prog < level )
		return;
	
	const seed1 = random(1000),
		seed2 = random(1000);
		
	const growthLevel = (prog - level > 1) || (prog >= maxLevel + 1) ? 1 : (prog - level);
	
  strokeWeight(3);

	// strokeWeight((12 * Math.pow((maxLevel - level + 1) / maxLevel, 2)) * size/200);

	const len = ( level === 1 && initalLength ) ? initalLength : random(1) * (growthLevel * size* (1 + rand2() * lenRand));
	const rc = rough.canvas(document.getElementById('defaultCanvas0'));

  rc.line(0, 0, 0, len / level, {roughness: 2});
  translate(0, len / level);
  
	const doBranch1 = rand() < branchProb || level === 1;
	const doBranch2 = rand() < branchProb || !doBranch1 || level === 1;
	
	var doLeaves = rand() < leafProb;
	
	if ( level < maxLevel )
	{
		
		var r1 = rot * (1 + rand2() * rotRand);
		var r2 = -rot * (1 - rand2() * rotRand);
		
		if ( doBranch1 )
		{
			push();
			rotate(r1);
			branch({
        ...settings,
        level: level + 1, 
        seed: seed1,
      });
			pop();
		}
		if ( doBranch2 )
		{
			push();
			rotate(r2);
			branch({
        ...settings,
        level: level + 1, 
        seed: seed2,
      });
			pop();
		}
	}
	
	if ( (level >= maxLevel || (!doBranch1 && !doBranch2)) && doLeaves )
	{
		const k = Math.min(1, Math.max(0, prog - level));
		
		var flowerSize = k * (1 / 6) * (len / level);

		strokeWeight(1);
		
		rotate(-PI);
    push();
    scale(1);
    if( !colored ) {
      const grey = 20 * rand2();
		  rc.path(
        leafPath,
        { 
          stroke: `rgba(${grey},${grey},${grey},1)`,
          fill: `rgba(${grey},${grey},${grey},1)`, 
          roughness: 0.1
        }
      );
    }
    else {
      rc.path(leafPath, {
        stroke: `rgba(${20},${205},${86},1)`, 
        fill: `rgba(${20},${205},${86},1)`,
        roughness: 0.1
        });
    }
    pop();
	}	
};