<template>
  <v-card>
    <v-card-text style="overflow:scroll">
      <div class="text-none overline mb-4">.github/workflows/issue.yml</div>
<code class="px-4" style="width: 100%;" ref="code">
name: Labeling new issue
on:
  issues:
      types: {{ fields.types }}
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: Renato66/auto-label@{{ version }}
        with:
          repo-token: {{ `$\{\{ secrets.${fields.secret} \}\}` }}{{ fields.ignoreComments ? '' : `\n          ignore-comments: ${fields.ignoreComments}` }}{{ fields.labelsSynonyms === '{}' ? '' : `\n          labels-synonyms: \'${fields.labelsSynonyms}\'` }}{{ fields.labelsNotAllowed === '[]' ? '' : `\n          labels-not-allowed: '${fields.labelsNotAllowed}'` }}{{ fields.defaultLabels === '[]' ? '' : `\n          default-labels: '${fields.defaultLabels}'` }}
</code>
    </v-card-text>
    <v-card-actions class="pb-4 pt-0">
      <v-spacer></v-spacer>
       <v-tooltip v-model="copied" right>
        <template v-slot:activator="{ on }">
          <span v-on="on" class="white--text">x</span>
          <v-btn
            outlined
            color="primary"
            @click="copyCode"

          >
            {{ $t('yml.copy') }}
          </v-btn>
        </template>
        <span>{{ $t('yml.copied') }}</span>
      </v-tooltip>
      <v-spacer></v-spacer>
    </v-card-actions>
     <textarea type="hidden" id="testing-code" :value="code" style="position: absolute;top: 0;z-index: -1;">
     </textarea>
  </v-card>
</template>

<script>
export default {
  props: {
    fields: {
      type: Object
    }
  },
  data () {
    return {
      code: '',
      copied: false,
      version: ''
    }
  },
  methods: {
    copyCode () {
      this.code = this.$refs.code.innerHTML.replace('\n', '')
      setTimeout(() => {
        let testingCodeToCopy = document.querySelector('#testing-code')
        testingCodeToCopy.setAttribute('type', 'text')
        testingCodeToCopy.select()
        try {
          const successful = document.execCommand('copy')
          this.copied = successful
          setTimeout(() => {
            this.copied = false
          }, 1500)
        } catch (err) {
          alert('Oops, unable to copy')
        }
        testingCodeToCopy.setAttribute('type', 'hidden')
        window.getSelection().removeAllRanges()
      }, 500)
    }
  },
  async mounted () {
    try {
      const response = await fetch(` https://api.github.com/repos/renato66/auto-label/releases/latest`)
      if (response.ok) { // if HTTP-status is 200-299
        const result = await response.json()
        this.version = result.tag_name
      } else {
        throw new Error(response.status)
      }
    } catch (error) {
      console.log(error)
      alert('error getting lastest version')
    }
  }
}
</script>

<style>

</style>
