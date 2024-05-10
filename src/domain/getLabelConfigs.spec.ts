import { expect, describe, test, mock, jest } from 'bun:test'
import { getLabelConfigs } from './getLabelConfigs'
import * as core from '@actions/core'

const configurationPath = 'src/__mock__/config'
const defaultConfig = {
  labelsSynonyms: {
    bug: ['error']
  },
  labelsNotAllowed: ['documentation'],
  defaultLabels: ['triage'],
  ignoreComments: true
}
describe('getLabelConfigs', () => {
  test('should return label configurations from a valid JSON folder path', () => {
    const options = [`${configurationPath}/`, `${configurationPath}`]
    options.forEach((elem) => {
      const result = getLabelConfigs(elem)
      expect(result).toEqual(defaultConfig)
    })
  })

  test('should return label configurations from a valid JSONC file path', () => {
    const result = getLabelConfigs(`${configurationPath}/auto-label.jsonc`)
    expect(result).toEqual(defaultConfig)
  })

  test('should return label configurations from a valid JSON5 file path', () => {
    const result = getLabelConfigs(`${configurationPath}/auto-label.json5`)
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
