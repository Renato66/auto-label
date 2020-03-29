<template>
  <v-card>
    <v-card-text style="overflow:scroll">
      <div class="text-none overline mb-4">.github/workflows/issue.yml</div>
<code class="px-4" style="width: 100%;">
name: Labeling new issue
on:
  issues:
      types: {{ fields.types }}
jobs:
  build:
    runs-on: ubuntu-latest
  steps:
    - uses: Renato66/auto-label@v2.0.0
      with:
        repo-token: {{ `\{\{ secrets.${fields.secret} \}\}` }}{{ fields.ignoreComments ? '' : `\n        ignore-comments: ${fields.ignoreComments}` }}{{ fields.labelsSynonyms === '{}' ? '' : `\n        labels-synonyms: \'${fields.labelsSynonyms}\'` }}{{ fields.labelsNotAllowed === '[]' ? '' : `\n        labels-not-allowed: '${fields.labelsNotAllowed}'` }}
</code>
    </v-card-text>
    <v-card-actions class="pb-4 pt-0">
      <v-spacer></v-spacer>
      <v-btn
        text
        outlined
        color="primary"
      >
        Copy
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    fields: {
      type: Object
    }
  }
}
</script>

<style>

</style>
