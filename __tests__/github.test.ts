jest.mock('@actions/github')
const github = require('@actions/github')
const githubMock = require('./__mock__/@actions/github')

const { getRepoLabels, addLabels } = require('../src/github.ts')
describe('Testing compareLabels function', () => {
  github.mockReturnValue(githubMock);
  const client = {
    issues: {
      listLabelsForRepo: async () => {
        return ['new', 'feature', 'bug']
      }
    }
  }
  it('should find the labels', async () => {
    console.log(getRepoLabels(client))
  });
});
