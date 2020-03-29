module.exports = {
  'transpileDependencies': [
    'vuetify'
  ],

  publicPath: process.env.NODE_ENV === 'production'
    ? '/auto-label/'
    : '/',

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
