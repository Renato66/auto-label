const path = require('path'); const
  PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

module.exports = {
  'transpileDependencies': [
    'vuetify'
  ],

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },

  configureWebpack: config => {
    if (process.env.NODE_ENV !== 'production') return
    return {
      plugins: [
        new PrerenderSPAPlugin({
          staticDir: path.join(__dirname, 'dist'),
          routes: ['/'],
          minify: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            decodeEntities: true,
            keepClosingSlash: true,
            sortAttributes: true
          },
          server: {
            port: 8001
          },
          renderer: new Renderer({
            renderAfterDocumentEvent: 'render-event'
          })
        })
      ]
    }
  }
}
