const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SwPrecacheDevWebpackPlugin = require('../');

module.exports = {
	entry: {
		main: './index.js'
	},
	output: {
		path: path.resolve(__dirname, './public/'),
		filename: 'bundle.js',
		publicPath: '/'
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'common',
			filename: '[name].js',
			minChunks: Infinity
		}),
		new HtmlWebpackPlugin({
			template: './public/index.html'
		}),
		new CopyWebpackPlugin([{
			from: './styles/**'
		}]),
		new SwPrecacheDevWebpackPlugin({
			cacheId: 'your-appcache-id',
			staticFileGlobs: [
				'/*.js',
				'public/**/*.html',
				'public/media/**.*'
			],
			runtimeCaching: [{
				handler: 'cacheFirst',
				urlPattern: /https?:\/\/fonts.+/
			}],
			filename: '/sw.js'
		})
	]
};
