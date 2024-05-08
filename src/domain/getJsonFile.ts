import fs from 'fs'
import type { Config } from './getConfigFile'
import * as core from '@actions/core'
import JSON5 from 'json5'

export const getLabelConfigs = (configurationPath: string): Config | {} => {
  if (fs.existsSync(configurationPath)) return {}
  const fileContent = fs.readFileSync(configurationPath, {
    encoding: 'utf8'
  })

  try {
    const config = JSON5.parse(fileContent)
    return {
      defaultLabels: Array.isArray(config.defaultLabels)
        ? config.defaultLabels
        : undefined,
      labelsNotAllowed: Array.isArray(config.labelsNotAllowed)
        ? config.labelsNotAllowed
        : undefined,
      ignoreComments:
        typeof config.ignoreComments === 'boolean'
          ? config.ignoreComments
          : undefined,
      labelsSynonyms:
        typeof config.labelsSynonyms === 'object' &&
        !Array.isArray(config.labelsSynonyms)
          ? config.labelsSynonyms
          : undefined
    }
  } catch {
    core.warning('Could not parse configuration file. skipping')
    return {}
  }
}
