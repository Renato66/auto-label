import { expect, describe, test, mock, jest } from 'bun:test'
import '@actions/github'
import { run } from './runner'

// // Mock core functions
mock.module('@actions/core', () => ({
  getInput: jest.fn((input) => {
    return input === 'repo-token' ? 'mockedToken' : undefined
  }),
  info: jest.fn(),
  startGroup: jest.fn(),
  endGroup: jest.fn(),
  setFailed: jest.fn()
}))

// Mock github context
const mockIssue = { number: 123, body: 'Mocked issue body label1' }
const mockContext = {
  payload: {
    issue: mockIssue
  }
}
mock.module('@actions/github', () => ({
  getOctokit: jest.fn(),
  context: mockContext
}))

// // Mock service functions
const addLabelsSpy = jest.fn()
let getRepoLabels = ['label1']
mock.module('./service/github', () => ({
  addLabels: addLabelsSpy,
  getRepoLabels: jest.fn(() => getRepoLabels),
}))

describe('run function', () => {
  test('should add if any found label', async () => {
    mock.module('@actions/core', () => ({
      getInput: jest.fn((input: string) => {
        const options: Record<string, string> = {
          'repo-token': 'mockedToken',
          'configuration-file': 'src/__mock__/config/empty.json',
          'default-labels': '["label1"]'
        }
        return options[input] || undefined
      })
    }))
    await run()
    expect(addLabelsSpy.mock.calls).toEqual([[ undefined, 123, [ 'label1' ] ]])
  })
  test('should throw an error if no token', async () => {
    mock.module('@actions/core', () => ({
      getInput: jest.fn(() => undefined),
      info: jest.fn(),
      startGroup: jest.fn(),
      endGroup: jest.fn(),
      setFailed: jest.fn()
    }))
    expect(async () => await run()).toThrowError()
  })
  test.skip('should add if no label is found and failover default labels are set', async () => {
    // skip because it's not working https://github.com/oven-sh/bun/issues/7823
    getRepoLabels = []
    mock.module('@actions/core', () => ({
      getInput: jest.fn((input: string) => {
        const options: Record<string, string> = {
          'repo-token': 'mockedToken',
          'configuration-file': 'src/__mock__/config/empty.json',
          'default-labels': '["label3"]',
          'failover-labels': '["label2"]'
        }
        return options[input] || undefined
      })
    }))
    await run()
    expect(addLabelsSpy.mock.calls).toEqual([[ undefined, 123, [ 'label2', 'label3' ] ]])
  })
})
