<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <h1>
          Auto Label
        </h1>
      </div>
      <v-spacer></v-spacer>
      <v-btn href="https://github.com/Renato66/auto-label" target="_blank" icon>
        <v-icon>
          mdi-github
        </v-icon>
      </v-btn>
      <LocaleChange />
    </v-app-bar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import LocaleChange from '@/components/LocaleChange'
export default {
  name: 'App',
  components: {
    LocaleChange
  },
  mounted () {
    document.dispatchEvent(new Event('render-event'))
  }
}
</script>
