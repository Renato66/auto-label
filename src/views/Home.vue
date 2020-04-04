<template>
  <v-container class="pt-8">
    <v-layout row wrap>
      <v-flex xs12 sm5 px-2>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12>
              <h2>
                {{ $t('types.title') }}
              </h2>
            </v-flex>
            <v-flex>
              <v-radio-group v-model="types" row>
                <v-radio :label="$t('types.opened')" value="['opened']"></v-radio>
                <v-radio :label="$t('types.edited')" value="['edited']"></v-radio>
                <v-radio :label="$t('types.both')" value="['opened', 'edited']"></v-radio>
              </v-radio-group>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12>
              <h2>
                {{ $t('secret.title') }}
              </h2>
              <p class="mb-0" v-html="$t(`secret.details.${secret}`)"></p>
            </v-flex>
            <v-flex xs12>
              <v-radio-group v-model="secret" row>
                <v-radio :label="$t('secret.token')" value="GITHUB_TOKEN"></v-radio>
                <v-radio :label="$t('secret.userToken')" value="GITHUB_USER_TOKEN"></v-radio>
              </v-radio-group>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12>
              <h2>
                {{ $t('ignoreComments.title') }}
              </h2>
            </v-flex>
            <v-flex xs12>
              <v-switch v-model="ignoreComments" inset :label="$t(`ignoreComments.${ignoreComments}`)"></v-switch>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <h2>
                {{ $t('repo.title') }}
              </h2>
              <p class="">
                {{ $t('repo.details') }}
              </p>
            </v-flex>
            <v-flex xs8>
              <v-text-field
              :label="$t('repo.label')"
              solo
              v-model="repo"
              @keypress.enter="searchLabels"
              prepend-inner-icon="mdi-github"
              :loading="loading"
              :disabled="labelList.length !== 0"
              hint="https://www.github.com/"
              >
              <template v-slot:message>
                https://www.github.com/<span class="primary--text">:owner</span>/<span  class="primary--text">:repo</span>
              </template>
              </v-text-field>

            </v-flex>
            <v-flex xs3 pt-2 pl-4>
              <v-btn icon color="primary" @click="searchLabels"  v-if="labelList.length === 0">
                <v-icon>
                  mdi-magnify
                </v-icon>
              </v-btn>
              <v-btn icon color="primary" @click="clearRepo"  v-else>
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout row wrap v-if="labelList.length !== 0">
            <v-flex xs12>
              <h2>
                {{ $t('lables.title') }}
              </h2>
              <p class="">
                {{ $t('lables.details') }}
              </p>
            </v-flex>
            <v-flex xs12 v-for="(label, index) in labelList" :key="index">
              <v-checkbox
                @change="toggleLabel(label.name)"
                :value-comparator="() => { return isAllowed(label.name)}"
                inset
                color="primary"
                :value="label.name">
                <template v-slot:label>
                  <v-hover
                    v-slot:default="{ hover }"
                    open-delay="100"
                  >
                    <div>
                      <v-expand-transition>
                        <div v-show="hover" style="position:absolute; padding-top:26px;z-index:1;width:100%">
                          <v-btn @click.stop="openSynonyms(label.name)"  rounded dark x-small color="primary" class="text-none" >
                            <v-icon x-small left>
                              mdi-plus
                            </v-icon>
                            Add synonyms
                          </v-btn>
                          <v-btn @click.stop="toggleDefault(label.name)"  rounded dark x-small color="primary" class="ml-2 text-none" >
                            <v-icon x-small left>
                              mdi-plus
                            </v-icon>
                            Set default
                          </v-btn>
                        </div>
                      </v-expand-transition>
                      {{label.name}}
                      <span class="ml-1 caption primary--text" v-if="isDefault(label.name)">(Default)</span>
                      <span class="ml-1 caption primary--text" v-if="labelsSynonyms[label.name]">({{ `+ ${labelsSynonyms[label.name].length} Synonyms` }})</span>
                    </div>
                  </v-hover>
                </template>
              </v-checkbox>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
      <v-flex xs12 sm7 px-2>
        <YmlTransform :fields="fields" />
      </v-flex>
    </v-layout>
    <ModalSynonyms :label.sync="label" :synonyms.sync="labelsSynonyms[label]" />
  </v-container>
</template>

<script>
import YmlTransform from '@/components/YmlTransform'
import ModalSynonyms from '@/components/ModalSynonyms'
export default {
  name: 'Home',
  components: {
    YmlTransform,
    ModalSynonyms
  },
  data () {
    return {
      label: '',
      repo: '',
      labelList: [],
      loading: false,
      secret: 'GITHUB_TOKEN',
      types: '[\'opened\']',
      ignoreComments: true,
      labelsSynonyms: {},
      labelsNotAllowed: [],
      defaultLabels: [],
      compiled: {
        labelsSynonyms: '',
        labelsNotAllowed: '',
        defaultLabels: ''
      }
    }
  },
  methods: {
    clearRepo () {
      this.repo = ''
      this.labelList = ''
      this.$set(this, 'labelsSynonyms', {})
      this.$set(this, 'labelsNotAllowed', [])
      this.$set(this, 'defaultLabels', [])
      this.ymlCompile('labelsSynonyms')
      this.ymlCompile('labelsNotAllowed')
      this.ymlCompile('defaultLabels')
    },
    openSynonyms (value) {
      this.label = value
    },
    toggleDefault (value) {
      if (!this.isDefault(value)) {
        this.$set(this.labelsSynonyms, value, undefined)
        this.ymlCompile('labelsSynonyms')
        this.defaultLabels = [...this.defaultLabels, value]
        this.labelsNotAllowed = this.labelsNotAllowed.filter(elem => elem !== value)
      } else {
        this.defaultLabels = this.defaultLabels.filter(elem => elem !== value)
      }
      this.ymlCompile('defaultLabels')
    },
    toggleLabel (value) {
      if (this.isAllowed(value)) {
        this.$set(this.labelsSynonyms, value, undefined)
        this.defaultLabels = this.defaultLabels.filter(elem => elem !== value)
        this.ymlCompile('labelsSynonyms')
        this.labelsNotAllowed = [...this.labelsNotAllowed, value]
      } else {
        this.labelsNotAllowed = this.labelsNotAllowed.filter(elem => elem !== value)
      }
      this.ymlCompile('labelsNotAllowed')
    },
    isAllowed (value) {
      return !this.labelsNotAllowed.some(elem => elem === value)
    },
    isDefault (value) {
      return this.defaultLabels.some(elem => elem === value)
    },
    async searchLabels () {
      try {
        console.log(this.repo.split('').length)
        if (this.labelList.length !== 0) return
        if (this.repo.split('/').length !== 2) return
        const response = await fetch(`https://api.github.com/repos/${this.repo}/labels`)
        if (response.ok) { // if HTTP-status is 200-299
          const list = await response.json()
          this.labelList = list
        } else {
          throw new Error(response.status)
        }
      } catch (error) {
        alert(this.$t('repo.error'))
      }
    },
    ymlCompile (field) {
      this.$set(this.compiled, field, JSON.stringify(this[field]).replace(/'/g, '\'\''))
    }
  },
  watch: {
    label (value, lastValue) {
      if (value === '') {
        if (this.isDefault(lastValue)) {
          this.defaultLabels = this.defaultLabels.filter(elem => elem !== lastValue)
        }
        if (!this.isAllowed(lastValue)) {
          this.labelsNotAllowed = this.labelsNotAllowed.filter(elem => elem !== lastValue)
        }
        this.ymlCompile('labelsSynonyms')
      }
    },
    labelsNotAllowed () {
      this.ymlCompile('labelsNotAllowed')
    },
    defaultLabels () {
      this.ymlCompile('defaultLabels')
    }
  },
  computed: {
    fields () {
      return {
        secret: this.secret,
        types: this.types,
        ignoreComments: this.ignoreComments,
        labelsSynonyms: this.compiled.labelsSynonyms,
        labelsNotAllowed: this.compiled.labelsNotAllowed,
        defaultLabels: this.compiled.defaultLabels
      }
    }
  },
  mounted () {
    this.ymlCompile('labelsSynonyms')
    this.ymlCompile('labelsNotAllowed')
    this.ymlCompile('defaultLabels')
  }
}
</script>

<style>
/* hotfix */
.v-icon.notranslate.mdi.mdi-checkbox-marked.theme--light{
  color:#1975d2
}
</style>
