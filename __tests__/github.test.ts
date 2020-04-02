import nock from 'nock'
import * as path from 'path'
import * as github from '@actions/github'
import { getRepoLabels, addLabels } from '../src/github'

const fakeRepo = 'frontendbr/vagas'
process.env['GITHUB_REPOSITORY'] = fakeRepo;

describe('Testing compareLabels function', () => {
  it('should find the labels', async () => {
    const labelsList = require(`./__mock__/${fakeRepo}/labels.json`)
    nock('https://api.github.com')
      .persist()
      .get(`/repos/${fakeRepo}/labels`)
      .reply(200, labelsList);

    const client = new github.GitHub('fakeToken')
    const labelsNotAllowed = []
    const result = await getRepoLabels(client, labelsNotAllowed)
    expect(result.length).toBe(labelsList.length)
  });

  it('should not remove any label', async () => {
    process.env['INPUT_LABELS-NOT-ALLOWED'] = `["NotListedLabel"]`
    const labelsList = require(`./__mock__/${fakeRepo}/labels.json`)
    nock('https://api.github.com')
      .persist()
      .get(`/repos/${fakeRepo}/labels`)
      .reply(200, labelsList);

    const client = new github.GitHub('fakeToken')
    const labelsNotAllowed = ['NotListedLabel']
    const result = await getRepoLabels(client, labelsNotAllowed)
    expect(result.length).toBe(labelsList.length)
  });

  it('should remove one label', async () => {
    process.env['INPUT_LABELS-NOT-ALLOWED'] = `["Remoto"]`
    const labelsList = require(`./__mock__/${fakeRepo}/labels.json`)
    nock('https://api.github.com')
      .persist()
      .get(`/repos/${fakeRepo}/labels`)
      .reply(200, labelsList);

    const client = new github.GitHub('fakeToken')
    const result = await getRepoLabels(client)
    expect(result.length).toBe(labelsList.length - 1)
  });
    
  it('should insert', async () => {
    const client = new github.GitHub('fakeToken')
    const payload = require(`./__mock__/${fakeRepo}/payload.json`)
    nock('https://api.github.com')
      .persist()
      .post(`/repos/${fakeRepo}/issues/${payload.issue.number}/labels`)
      .reply(200);
    await addLabels(client, payload.issue.number, ['Remoto'])
  });
});
