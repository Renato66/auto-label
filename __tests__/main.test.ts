import * as path from 'path'
import nock from 'nock'

const fakeRepo = 'frontendbr/vagas'

describe('Testing action functionalitie', () => {
  it('should find the labels', async () => {
    process.env['INPUT_REPO-TOKEN'] = 'fakeToken';
    process.env['INPUT_IGNORE-COMMENTS'] = 'true';
    process.env['INPUT_LABELS-NOT-ALLOWED'] = '[]';
    
    process.env['GITHUB_REPOSITORY'] = fakeRepo;
    process.env['GITHUB_EVENT_PATH'] = path.join(__dirname, `__mock__/${fakeRepo}/payload.json`);
    const payload = require(`./__mock__/${fakeRepo}/payload.json`)
    const labelsList = require(`./__mock__/${fakeRepo}/labels.json`)

    nock('https://api.github.com')
      .persist()
      .get(`/repos/${fakeRepo}/labels`)
      .reply(200, labelsList);
    nock('https://api.github.com')
      .persist()
      .post(`/repos/${fakeRepo}/issues/${payload.issue.number}/labels`)
      .reply(200);
    const main = require('../src/main');

    await main.run();
  });
});
