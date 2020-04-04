<template>
  <v-menu content-class="br-8" offset-y>
    <template v-slot:activator="{ on }">
      <v-btn icon large :ripple="false" aria-label="Choose language" v-on="on">
        <v-avatar size="24" tile>
          <v-img :src="selectedLocale.flag" />
        </v-avatar>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item
        v-for="locale in filteredLocales"
        :key="locale.id"
        :aria-label="`Choose ${locale.name} language`"
        @click="selectLocale(locale.id)"
      >
        <v-avatar size="24" tile>
          <v-img :src="locale.flag" />
        </v-avatar>
        <div class="ml-2">
          {{ locale.name }}
        </div>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  data () {
    return {
      supportedLocales: [
        {
          id: 'pt',
          name: 'Português',
          flag: 'https://www.countryflags.io/BR/flat/24.png'
        },
        {
          id: 'en',
          name: 'English',
          flag: 'https://www.countryflags.io/US/flat/24.png'
        }
      ]
    }
  },
  computed: {
    selectedLocale () {
      return this.supportedLocales.find(elem => elem.id === this.$i18n.locale)
    },
    filteredLocales () {
      return this.supportedLocales.filter(elem => elem.id !== this.$i18n.locale)
    }
  },
  methods: {
    selectLocale (value) {
      this.$i18n.locale = value
      this.$router.replace({ query: { lang: value } })
    }
  }
}
</script>

<style>

</style>
