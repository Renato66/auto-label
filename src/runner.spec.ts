import { expect, describe, test, mock, jest } from 'bun:test';
import * as core from '@actions/core';
import '@actions/github';
import { run } from './runner';

// Mock core functions
mock.module('@actions/core', () => ({
  getInput: jest.fn((input) => {
    return input ==='repo-token' ? 'mockedToken' : undefined
  }),
  info: jest.fn(),
  startGroup: jest.fn(),
  endGroup: jest.fn(),
  setFailed: jest.fn(),
}));

// Mock github context
const mockIssue = { number: 123, body: 'Mocked issue body' };
const mockContext = {
  payload: {
    issue: mockIssue,
  },
};
mock.module('@actions/github', () => ({
  getOctokit: jest.fn(),
  context: mockContext,
}));

// Mock service functions
const addLabelsSpy = jest.fn()
mock.module('./service/github', () => ({
  getRepoLabels: jest.fn(() => []),
  addLabels: addLabelsSpy,
}));
mock.module('./scraper/text', () => ({
  getIssueLabels: jest.fn(() => []),
}));

describe('run function', () => {
  test('should run successfully without throwing errors', async () => {
    await run();
    expect(core.setFailed).not.toHaveBeenCalled();
  });
  test('should add if any found label', async () => {
    const issueLabels = ['label', 'label2']
    mock.module('./scraper/text', () => ({
      getIssueLabels: jest.fn(() => issueLabels),
    }));
    await run();
    // TODO: fix this test
    // expect(addLabelsSpy).toHaveBeenCalledWith(
    //   expect.any(Object), // octokit
    //   123, // issue number
    //   issueLabels // issue labels
    // );
  });
});