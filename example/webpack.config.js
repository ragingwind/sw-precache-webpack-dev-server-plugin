const path = require('path');
const SwPrecacheDevWebpackPlugin = require('../');

module.exports = {
	entry: {
		main: path.join(__dirname, '/index.js')
	},
	output: {
		path: path.resolve(__dirname, '../build'),
		filename: 'bundle.js',
		publicPath: '/'
	},
	plugins: [
		new SwPrecacheDevWebpackPlugin({
			// sw-precache options
			cacheId: 'your-appcache-id',
			staticFileGlobs: [
				'/*.js'
			],
			runtimeCaching: [{
				handler: 'cacheFirst',
				urlPattern: /https?:\/\/fonts.+/
			}],
			// plugin options
			filename: '/sw.js'
		})
	]
};
