const path = require('path');

module.exports = {
  modulePaths: [
    '<rootDir>'
  ],

  // TODO: We'll need to look in to how to change this if we want to use this
  // config file for server-side tests.
  testEnvironment: "jsdom",
  transform: {
    "\\.tsx?$": [
    	"babel-jest",
	{
	    // Specifying the Babel config file explicitly so we can use
	    // different config files for different extensions. The TSX
	    // config file processes all extensions, so we can't share this file
	    // for TS code that doesn't use TSX.
	    configFile: path.resolve("babel.tsx.config.js")
	}
    ]
  },
};
