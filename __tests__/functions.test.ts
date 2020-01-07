const { compareLabels, getIssueLabels } = require('../src/functions.ts')

describe('Testing compareLabels function', () => {
  it('should find the labels', async () => {
    const hasLabels: Function = compareLabels(['THING','ITEM', 'FOO'])
    expect(hasLabels('test ITEM tesFOO testTHING')).toStrictEqual(['ITEM']);
  });

  it('should find the labels insensitive', async () => {
    const hasLabels: Function = compareLabels(['THING'])
    expect(hasLabels('test thing', ['THING'])).toStrictEqual(['THING']);
  });

  it('should find the exact word', async () => {
    const hasLabels: Function = compareLabels(['BUG'])
    expect(hasLabels('testing or debugin', ['BUG'])).toStrictEqual([]);
  });

  it('should`t find the labels', async () => {
    const hasLabels: Function = compareLabels(['THING','ITEM', 'FOO'])
    expect(hasLabels('test')).toStrictEqual([]);
  });
});
describe('Testing getIssueLabels function', () => {
  it('should `new` label', async () => {
    const body = `Testing new feature
    not buggy
    at all...`
    const labels = ['bug', 'test', 'new']
    console.log(getIssueLabels(body, labels, false))
    expect(getIssueLabels(body, labels, false)).toStrictEqual(['new']);
  });
});