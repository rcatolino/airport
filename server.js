/* server.js: run this with Node.js in the publish/ folder to start your server.
 * Copyright © 2011 Jan Keromnes, Thaddee Tyl. All rights reserved.
 * Code covered by the LGPL license. */


// Import modules
var fs = require('fs'),
    camp = require ('./camp/camp.js');


// Start the server
function start(config) {

  // Get current config by Ajax
  camp.add('pullconfig', function(data) {
    return config;
  });
  
  // Overwrite configuration by Ajax
  camp.add('pushconfig', function(newconfig) {
    config = newconfig;
  });

	camp.Plate.macros['l'] = function ( literal, params ) {
		console.log(literal[params[0]]);
		var rail = literal[params[0]];
		var nl = "M";
		var nl += literal.nodes[rail.points[0]].x + " " + literal.nodes[rail.points[0]].y;
		for (var i=1; i<rail.points.length; i++) {
			console.log(literal.nodes[rail.points[i]]);
		}
		return nl;
	};

  // Add objects from config to index2.html
	camp.handle('/lol.html', function(query, path) {
		console.log('templating index');
		return {
			wagons: config.airport.wagons,
			rails: config.airport.rails,
		  nodes: config.airport.nodes
		};
	});

  // Display the current config as a JSON file
  camp.handle('/config.json', function(query, path) {
    return {"content":JSON.stringify(config,null,2)};
  });

  // Finally start the server
  camp.start(config.port || 80, config.debug || 0);
}

// Main function
(function main() {
  var config = process.argv[2] || '../config.json';

	console.log('starting...');

  fs.readFile(config, function(err, data) {
    if ( err ) throw err;
    start(JSON.parse(data));
  });
  
})();
