'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const REPO_ROOT = path.resolve(__dirname, '..');
const ASSETS_DIR = path.join(REPO_ROOT, 'assets');
const PACKAGE_JSON = path.join(REPO_ROOT, 'package.json');

/**
 * `webpack serve` and the `webpack-dev-server` bin (which injects `serve`) both put `serve` in argv.
 * webpack-cli 4 only hands WEBPACK_SERVE to function-style configs, never to process.env.
 */
function isDevServer() {
  return process.argv.slice(2).includes('serve');
}

function staticAssetBase() {
  const { assetVersion } = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));
  return `https://static.matterport.com/showcase-sdk/examples/${assetVersion}/assets`;
}

/**
 * Code expression for the `__ASSET_BASE__` DefinePlugin constant: the repo-root `assets/`
 * folder served by the dev server, or the published static.matterport.com URL otherwise.
 */
function assetBaseExpression() {
  const useLocalAssets = isDevServer() && fs.existsSync(ASSETS_DIR) && process.env.ASSET_SOURCE !== 'static';

  if (useLocalAssets) {
    // Loaded inside the Showcase iframe, so it has to be runtime-absolute, not a relative path.
    return 'window.location.origin + "/assets"';
  }
  return JSON.stringify(staticAssetBase());
}

function assetDefinePlugin() {
  return new webpack.DefinePlugin({
    __ASSET_BASE__: assetBaseExpression(),
  });
}

/**
 * Merges repo-root `assets/` into a package's devServer.static config at `/assets`,
 * preserving whatever static config the package already has.
 */
function withAssetDevServer(devServer = {}) {
  if (!fs.existsSync(ASSETS_DIR)) return devServer;

  const existing = devServer.static ? (Array.isArray(devServer.static) ? devServer.static : [devServer.static]) : [];

  return {
    ...devServer,
    static: [...existing, { directory: ASSETS_DIR, publicPath: '/assets' }],
  };
}

module.exports = { assetDefinePlugin, withAssetDevServer, ASSETS_DIR };
