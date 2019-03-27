const CompressionPlugin = require('compression-webpack-plugin')
const webpack = require('webpack')
const https = require('https')
const keepAliveAgent = new https.Agent({ keepAlive: true })

module.exports = {
  publicPath: "/",
  css: {
    loaderOptions: {
      sass: {
        data: '@import "~@/styles/_main.sass"',
        indentedSyntax: true
      }
    }
  },
  chainWebpack: config => {
  },
  configureWebpack: {
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    plugins: process.env.NODE_ENV === 'production' ? [
			new CompressionPlugin({
				filename: '[path].br[query]',
				algorithm: 'brotliCompress',
				test: /\.(js|css|html|svg|json)$/,
				compressionOptions: { level: 11  },
				minRatio: 1,
				deleteOriginalAssets: false
			}),
      new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(require("./package.json").version)
      })
    ]:[
      new webpack.DefinePlugin({
        __VERSION__: JSON.stringify("local")
      })
    ]
  },
  pwa: {
    name: 'traQ',
    themeColor: '#ffffff',
    msTileColor: '#ffffff',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

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
