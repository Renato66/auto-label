import { expect, describe, test, mock, afterEach, jest } from 'bun:test'
import * as core from '@actions/core'
import { getConfigFile } from './getConfigFile'

describe('getConfigFile', () => {
  afterEach(() => {
    mock.module('@actions/core', () => core)
  })
  test('returns empty array when labels-not-allowed input is empty', () => {
    mock.module('@actions/core', () => ({
      getInput: jest.fn((input: string) => {
        const options: Record<string, string> = {
          'repo-token': 'mockedToken',
          'configuration-file': 'src/__mock__/config/empty.json',
          'labels-not-allowed': ''
        }
        return options[input] || undefined
      })
    }))
    const result1 = getConfigFile()
    expect(result1.labelsNotAllowed).toEqual([])
    mock.module('@actions/core', () => ({
      getInput: jest.fn((input: string) => {
        const options: Record<string, any> = {
          'repo-token': 'mockedToken',
          'configuration-file': 'src/__mock__/config/empty.json',
          'labels-not-allowed': undefined
        }
        return options[input] || undefined
      })
    }))
    const result2 = getConfigFile()
    expect(result2.labelsNotAllowed).toEqual([])
  })

  test('returns parsed array from labels-not-allowed input', () => {
    const labels = ['label1', 'label2']
    mock.module('@actions/core', () => ({
      getInput: jest.fn((input: string) => {
        const options: Record<string, string> = {
          'repo-token': 'mockedToken',
          'configuration-file': 'src/__mock__/config/empty.json',
          'labels-not-allowed': JSON.stringify(labels)
        }
        return options[input] || undefined
      })
    }))
    const result = getConfigFile()
    expect(result.labelsNotAllowed).toEqual(labels)
  })

  test('throws error if labels-not-allowed input is not valid JSON', () => {
    mock.module('@actions/core', () => ({
      getInput: jest.fn(() => 'not-valid-json')
    }))
    expect(getConfigFile).toThrowError()
  })
})
