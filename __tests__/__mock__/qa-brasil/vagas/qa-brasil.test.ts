import * as path from 'path'
import nock from 'nock'

const fakeRepo = 'qa-brasil/vagas'

describe('Testing action functionalitie', () => {
  it('should find the labels', async () => {
    process.env['INPUT_REPO-TOKEN'] = 'fakeToken'
    process.env['INPUT_IGNORE-COMMENTS'] = 'true'
    process.env['INPUT_LABELS-NOT-ALLOWED'] = '[]'
    process.env['INPUT_LABELS-SYNONYMS'] = '{"Inglês":["inglês","english"]}'
    process.env['GITHUB_REPOSITORY'] = fakeRepo
    process.env['GITHUB_EVENT_PATH'] = path.join(__dirname, `payload.json`)
    const payload = require(`./payload.json`)
    const labelsList = require(`./page-1.json`)

    nock('https://api.github.com')
      .persist()
      .get(`/repos/${fakeRepo}/labels?per_page=100&page=1`)
      .reply(200, labelsList)
    nock('https://api.github.com')
      .persist()
      .post(`/repos/${fakeRepo}/issues/${payload.issue.number}/labels`)
      .reply(200)
    const main = require('../../../../src/main')

    await main.run()
  })
})
