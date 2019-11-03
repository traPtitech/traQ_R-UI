const CompressionPlugin = require('compression-webpack-plugin')
const webpack = require('webpack')
const https = require('https')
const keepAliveAgent = new https.Agent({ keepAlive: true })

module.exports = {
  publicPath: '/',
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "~@/styles/_main.sass"',
        sassOptions: {
          indentedSyntax: true
        }
      }
    }
  },
  chainWebpack: config => {
    config.plugin('prefetch').tap(options => {
      options[0].include = 'allAssets'
      return options
    })
  },
  configureWebpack: {
    entry: {
      app: './src/main.js'
    },
    resolve: {
      extensions: ['ts', 'js'],
      alias: {
        vue$: 'vue/dist/vue.esm.js'
      }
    },
    output: {
      globalObject: 'self'
    },
    plugins:
      process.env.NODE_ENV === 'production'
        ? [
            new CompressionPlugin({
              filename: '[path].br[query]',
              algorithm: 'brotliCompress',
              test: /\.(js|css|html|svg|json)$/,
              compressionOptions: { level: 11 },
              minRatio: 1,
              deleteOriginalAssets: false
            }),
            new webpack.DefinePlugin({
              __VERSION__: JSON.stringify(require('./package.json').version)
            })
          ]
        : [
            new webpack.DefinePlugin({
              __VERSION__: JSON.stringify('dev')
            })
          ]
  },
  pwa: {
    name: 'traQ',
    themeColor: '#0D67EA',
    msTileColor: '#0D67EA',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    assetsVersion: require('./package.json').version,

    manifestPath: 'static/manifest.json',
    manifestOptions: {
      start_url: '/',
      background_color: '0D67EA',
      icons: [
        {
          src: '/static/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/static/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      gcm_sender_id: '103953800507'
    },
    iconPaths: {
      favicon32: 'static/favicon-32x32.png',
      favicon16: 'static/favicon-16x16.png',
      appleTouchIcon: 'static/apple-touch-icon.png',
      maskIcon: 'static/safari-pinned-tab.svg',
      msTileImage: 'static/mstile-150x150.png'
    },

    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'public/sw.js',
      swDest: 'sw.js'
    }
  },
  devServer: {
    proxy: {
      '^/api': {
        target: 'https://traq-dev.tokyotech.org',
        changeOrigin: true,
        agent: keepAliveAgent
      }
    }
  }
}
