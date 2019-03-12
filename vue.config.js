const CompressionPlugin = require('compression-webpack-plugin')

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
    plugins:[
			new CompressionPlugin({
				filename: '[path].br[query]',
				algorithm: 'brotliCompress',
				test: /\.(js|css|html|svg|json)$/,
				compressionOptions: { level: 11  },
				minRatio: 1,
				deleteOriginalAssets: false
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
  }
}
