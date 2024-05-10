import { expect, describe, test, mock, jest } from 'bun:test'
import * as core from '@actions/core'
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
mock.module('./service/github', () => ({
  getRepoLabels: jest.fn(() => ['label1']),
  addLabels: addLabelsSpy
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
    // expect(core.setFailed).not.toHaveBeenCalled()
    expect(addLabelsSpy).toHaveBeenCalled()
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
})
