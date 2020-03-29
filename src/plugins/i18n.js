import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from '../locales/en.json'
import pt from '../locales/pt.json'

Vue.use(VueI18n)

export default new VueI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en',
  messages: {
    'en': en,
    'pt': pt
  }
})
