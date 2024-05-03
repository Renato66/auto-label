import { expect, describe, test, mock, afterEach, jest } from 'bun:test'
import * as core from '@actions/core'
import { getInput } from './getInput'

describe('getInput', () => {
  afterEach(() => {
    mock.module('@actions/core', () => core)
  })
  test('returns default value when input is empty/undefined', () => {
    mock.module('@actions/core', () => ({
      getInput: jest.fn(() => undefined)
    }))
    const result1 = getInput<string[]>('input', [])
    expect(result1).toEqual([])
    mock.module('@actions/core', () => ({
      getInput: jest.fn(() => '')
    }))
    const result2 = getInput<string[]>('input', [])
    expect(result2).toEqual([])
  })

  test('returns parsed array from input', () => {
    const labels = ['label1', 'label2']
    mock.module('@actions/core', () => ({
      getInput: jest.fn(() => JSON.stringify(labels))
    }))
    const result = getInput<string[]>('input', [])
    expect(result).toEqual(labels)
  })

  test('throws error if input is not valid JSON', () => {
    mock.module('@actions/core', () => ({
      getInput: jest.fn(() => 'not-valid-json')
    }))
    expect(() => getInput<string[]>('input', [])).toThrowError()
  })
})
