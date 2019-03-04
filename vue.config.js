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
    }
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
