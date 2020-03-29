<template>
  <v-dialog
    v-model="open"
    max-width="450"
  >
    <v-card>
      <v-card-title class="headline primary white--text">
        <div class="mx-auto" style="text-align: center;word-break: break-word;">
          "{{ label }}"
        </div>
      </v-card-title>
      <v-card-text class="mt-4">
        <h2>
          {{ $t('modal.title') }}
        </h2>
        <p>
          {{ $t('modal.text') }}
        </p>
        <v-chip v-for="(text, index) in synonyms" color="primary" dark class="mr-2 mt-2" :key="index" close @click:close="remove(text)">
          {{ text }}
        </v-chip>
        <v-text-field
          class="mt-4"
          :label="$t('modal.label')"
          v-model="newSynonym"
          @keypress.enter="addSynonym"
          :hint="$t('modal.hint')"
          @focus="error = []"
          :error-messages="error"
          ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          text
          @click="close"
        >
          {{ $t('modal.done') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    label: {
      type: String
    },
    synonyms: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      newSynonym: '',
      error: []
    }
  },
  methods: {
    close () {
      if (this.error.length === 0 && this.newSynonym !== '') {
        this.error = [this.$t('modal.error', { text: this.newSynonym })]
      } else {
        this.open = false
      }
    },
    remove (value) {
      const synonyms = this.synonyms.filter(elem => elem !== value)
      this.$emit('update:synonyms', synonyms)
    },
    addSynonym () {
      const synonyms = [...this.synonyms, this.newSynonym].sort()
      this.$emit('update:synonyms', synonyms)
      this.newSynonym = ''
    }
  },
  computed: {
    open: {
      get () {
        return this.label !== ''
      },
      set () {
        this.error = []
        this.newSynonym = ''
        this.$emit('update:label', '')
      }
    }
  }
}
</script>

<style>

</style>
