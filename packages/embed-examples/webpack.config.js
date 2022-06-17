const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

/**
 * List of application directories w/ titles.
 */
const applications = [
  {
    chunkName: 'sensor-point-areas',
    title: 'Sensor - Point Areas',
  },
  {
    chunkName: 'sensor-sweep-control',
    title: 'Sensor - Sweep Control',
  },
  {
    chunkName: 'sensor-tags-level-of-detail',
    title: 'Sensor - Tags Level of Detail',
  },
  {
    chunkName: 'sensor-tags-per-sweep',
    title: 'Sensor - Tags per sweep',
  },
];

/**
 * Generate a chunk entry for each examples sub directory.
 */
const chunkEntries = function() {
  const chunks = {};
  for (const application of applications) {
    chunks[application.chunkName] = `./examples/${application.chunkName}/index.ts`;
  }
  return chunks;
};

/**
 * Generate application list html
 */
const computeAppListHtml = function() {
  const elements = [];
  elements.push('<ul>');
  
  for (const application of applications) {
    elements.push(`<li><a href="${application.chunkName}/index.html">${application.title}</a></li>`);
  }

  elements.push('</ul>');
  return elements.join('');
};

/**
 * Generate the plugins array.
 */
const computePlugins = function() {
  const plugins = [];

  plugins.push(new CleanWebpackPlugin());

  // application html
  for (const application of applications) {
    plugins.push(new HtmlWebpackPlugin({
      title: application.title,
      template: 'examples/common/index.ejs',
      filename: `${application.chunkName}/index.html`,
      inject: false,
    }));
  }

  // root html
  plugins.push(new HtmlWebpackPlugin({
    template: 'index.ejs',
    templateParameters: {
      title: 'Embed Examples',
      apps: computeAppListHtml(),
    },
    filename: 'index.html',
    inject: false,
  }));

  return plugins;
}

module.exports = function(config) {
  const plugins = [];

  const buildConfig = {
    mode: 'development',
    entry: chunkEntries(),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name]/bundle.js'
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: 'ts-loader'
        },
        { enforce: "pre", test: /\.js$/, use: ["source-map-loader"] },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ]
    },
    plugins: computePlugins(),
    devServer: {
      port: 8000,
      static: path.join(__dirname, 'dist'),
      devMiddleware: {
        writeToDisk: true
      }
    }
  }

  return buildConfig;
}
