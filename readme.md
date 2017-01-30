# sw-precache-webpack-dev-plugin

> Webpack Plugin for using sw-precache during development with webpack-dev-server


## Install

```sh
$ yarn add --dev sw-precache-webpack-dev-plugin
```

or
```sh
$ npm install --save sw-precache-webpack-dev-plugin
```

## Usage

See [basic webpack config files](./example/webpack.config.js) at examples.

### How to test

You can test this plugin by running example application with below commands. It will manage a service worker script while webpack devserver is running. Warn you, you need to make sure that the previous service worker script must be ungresitered or refleshed before you test with a newer version script of updating service worker configuration at webpack config.

```sh
$ yarn start
```

or
```sh
$ npm start
```

## Configuration

It will accept and pass through all of [options parameter of sw-precache](https://github.com/GoogleChrome/sw-precache#options-parameter) to [sw-precache](https://github.com/GoogleChrome/sw-precache). By the way, there are more options and a few of specical way to treats passed configurations.

### sw-precache Configurations

- staticFileGlobs: [Array<String>] - Default is empty array, allow dev server to cache all of files in assets on webpack complilation

### Plugin Configurations

- filename: [String] - Service worker script name for serving on dev server. It is same with [sw-precache-webpack-plugin](https://github.com/goldhand/sw-precache-webpack-plugin#configuration)

## Test

It will be provided soon

## License

MIT © [Jimmy Moon](http://ragingwind.me)
