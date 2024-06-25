import fs from 'fs'
import type { Config } from './getConfigFile'
import * as core from '@actions/core'
import JSON5 from 'json5'
const jsonTypes = ['json', 'jsonc', 'json5']

const getFilePath = (configurationPath: string): string | undefined => {
  const repoPath = `./${configurationPath}`
    .replace('//', '/')
    .replace('././', './')
  if (configurationPath.includes('.json') && fs.existsSync(repoPath))
    return repoPath
  if (!configurationPath.includes('.json')) {
    let allFiles;
    try {
      allFiles = fs.readdirSync(repoPath)
    } catch (error: any) {
      core.warning(
        `Could not read configuration file at ${repoPath}: ${error.message}. Skipping.`
      )
      return
    }
    const files = allFiles.filter((elem) =>
      jsonTypes.map((elem) => `auto-label.${elem}`).includes(elem)
    )
    if (!files.length) return
    return `${repoPath}/${files[0]}`.replace('//', '/')
  }
}

export const getLabelConfigs = (configurationPath: string): Config | {} => {
  const filePath = getFilePath(configurationPath)
  if (!filePath) return {}

  const fileContent = fs.readFileSync(filePath, {
    encoding: 'utf8'
  })

  try {
    const config = JSON5.parse(fileContent)
    const configObject = {
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
    return Object.fromEntries(
      Object.entries(configObject).filter(
        ([_key, value]) => value !== undefined
      )
    )
  } catch (error: any) {
    core.warning(
      `Could not parse configuration file at ${filePath}: ${error.message}. Skipping.`
    )
    return {}
  }
}
