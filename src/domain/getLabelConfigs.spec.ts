import { expect, describe, test, mock, jest } from 'bun:test'
import { getLabelConfigs } from './getLabelConfigs'
import * as core from '@actions/core'

const configurationPath = 'src/__mock__/config'
const defaultConfig = {
  'labels-synonyms': {
    bug: ['error']
  },
  'labels-not-allowed': ['documentation'],
  'default-labels': ['triage'],
  ignoreComments: true
}
describe('getLabelConfigs', () => {
  test('should return label configurations from a valid JSON folder path', () => {
    const options = [
      `${configurationPath}/valid/`,
      `${configurationPath}/valid`
    ]
    options.forEach((elem) => {
      const result = getLabelConfigs(elem)
      expect(result).toEqual(defaultConfig)
    })
  })

  test('should return label configurations from a valid JSONC file path', () => {
    const result = getLabelConfigs(`${configurationPath}/config.jsonc`)
    expect(result).toEqual(defaultConfig)
  })

  test('should return label configurations from a valid JSON5 file path', () => {
    const result = getLabelConfigs(`${configurationPath}/config.json5`)
    expect(result).toEqual(defaultConfig)
  })

  test('should return an empty object if the configuration file is not valid', () => {
    const options = [
      `${configurationPath}/invalid/invalid1.json`,
      `${configurationPath}/invalid/invalid2.json`
    ]
    options.forEach((elem) => {
      const result = getLabelConfigs(elem)
      expect(result).toEqual({})
    })
  })

  test('should send an warning if file is not readable', () => {
    mock.module('@actions/core', () => ({
      warning: jest.fn()
    }))
    const result = getLabelConfigs(`${configurationPath}/invalid/invalid3.json`)
    expect(result).toEqual({})
    mock.module('@actions/core', () => core)
  })
})
