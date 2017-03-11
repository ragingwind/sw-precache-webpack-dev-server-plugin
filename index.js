'use strict';

const path = require('path');
const crypto = require('crypto');
const swPrecache = require('sw-precache');
const multimatch = require('multimatch');
const glob = require('glob');
const isPathInside = require('is-path-inside');

function hash(data) {
	const md5 = crypto.createHash('md5');
	return md5.update(data + Date.now()).digest('hex');
}

function absolutePath(relativePath) {
	return path.resolve(process.cwd(), relativePath);
}

// DISCLAIMER: it can't make a right judge as patttern isn't starting
// without any hierarchical characaters like '/' or './'. For examples,
// ['*.js', '*.html'], in that case, we couldn't choice the location between
// file or root path on web server that result in gathering all files of both
function filterGlobs(context, globs) {
	const assetGlobs = [];
	let cachedFiles = [];

	globs.forEach(pattern => {
		const file = isPathInside(absolutePath(pattern), context);

		if (file) {
			cachedFiles = cachedFiles.concat(glob.sync(pattern.replace(path.sep, '/')));
		} else {
			assetGlobs.push(pattern);
		}
	});

	return {assetGlobs, cachedFiles};
}

function precache(assets, opts) {
	// will determine the location that each of file glob patterns
	// working on either file or memfs.
	let globs = filterGlobs(opts.context, opts.staticFileGlobs);

	// empty glob list to prevent precache to access files on webpack memfs
	opts.staticFileGlobs = [];

	return swPrecache.generate(opts).then(sw => {
		let cached = globs.cachedFiles;

		if (globs.assetGlobs.length > 0) {
			cached = cached.concat(Object.keys(assets).filter(a => {
				return multimatch(assets[a].existsAt, globs.assetGlobs).length > 0;
			}));
		}

		cached = cached.map(a => `['${a.startsWith('/') ? '' : '/'}${a}', '${hash(a)}']`);

		const timestamp = `// Manipulated by SWPrecacheWebpackDevPlugin ${new Date()}\n`;
		const re = new RegExp('var precacheConfig = \\[.*\\];', 'gi');
		const precache = `${timestamp}var precacheConfig = [${cached.join(', ')}]\n`;
		return sw.replace(re, precache);
	});
}

class SWPrecacheWebpackDevPlugin {
	constructor(opts) {
		this.opts = Object.assign({
			logger: function () {},
			filename: '/sw.js'
		}, opts);

		if (this.opts.filename.startsWith('/') === false) {
			this.opts.filename = '/' + this.opts.filename;
		}
	}

	apply(compiler) {
		compiler.plugin('after-emit', (compilation, done) => {
			// @TODO: May it change to process.cwd()
			this.opts.context = compiler.context;

			precache(compilation.assets, this.opts).then(sw => {
				const filepath = path.join(compiler.options.output.path, this.opts.filename);
				compiler.outputFileSystem.writeFile(filepath, sw, done);
			}, err => {
				throw new Error(`Precached failed: ${err.toString()}`)
			});
		});
	}
}

module.exports = SWPrecacheWebpackDevPlugin;
