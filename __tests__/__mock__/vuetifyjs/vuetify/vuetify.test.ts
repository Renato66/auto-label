import nock from 'nock'
import * as github from '@actions/github'
import {getRepoLabels} from '../../../../src/github'

const fakeRepo = 'vuetifyjs/vuetify'
process.env['GITHUB_REPOSITORY'] = fakeRepo

describe('Testing getRepoLabels function', () => {
  it('should find the 142 labels from vuetify', async () => {
    const page1 = require(`./page-1.json`)
    const page2 = require(`./page-2.json`)
    nock('https://api.github.com')
      .persist()
      .get(`/repos/${fakeRepo}/labels?per_page=100&page=1`)
      .reply(200, page1)
    nock('https://api.github.com')
      .persist()
      .get(`/repos/${fakeRepo}/labels?per_page=100&page=2`)
      .reply(200, page2)
    const labelsList = [...page1, ...page2]
    const client = new github.GitHub('fakeToken')
    const labelsNotAllowed = []
    const result = await getRepoLabels(client, labelsNotAllowed)
    expect(result.length).toBe(labelsList.length)
  })
})
