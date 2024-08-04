import fs from 'fs'
import type { Config } from './getConfigFile'
import * as core from '@actions/core'
import JSON5 from 'json5'
const jsonTypes = ['json', 'jsonc', 'json5']

const getFilePath = (configurationPath: string): string | undefined => {
  try {
    const repoPath = `./${configurationPath}`
      .replace('//', '/')
      .replace('././', './')
    if (configurationPath.includes('.json') && fs.existsSync(repoPath))
      return repoPath
    if (!configurationPath.includes('.json')) {
      const allFiles = fs.readdirSync(repoPath)

      const expectedFilenames = jsonTypes.map((type) => `auto-label.${type}`)
      const files = allFiles.filter((filename) =>
        expectedFilenames.includes(filename)
      )
      if (!files.length) {
        throw new Error('No default files located.')
      }
      return `${repoPath}/${files[0]}`.replace('//', '/')
    }
  } catch (error: any) {
    core.warning(
      `Could not read configuration file, configurationPath: "${configurationPath}", error: "${error.message}". Skipping.`
    )
    return
  }
}

const compareArray = (arr?: string[]) => (Array.isArray(arr) ? arr : undefined)
const compareBoolean = (bool?: boolean) =>
  typeof bool === 'boolean' ? bool : undefined
const compareObject = (obj?: Record<string, string[]>) =>
  typeof obj === 'object' && !Array.isArray(obj) ? obj : undefined

export const getLabelConfigs = (configurationPath: string): Config | {} => {
  const filePath = getFilePath(configurationPath)
  if (!filePath) return {}

  const fileContent = fs.readFileSync(filePath, {
    encoding: 'utf8'
  })

  try {
    const config = JSON5.parse(fileContent)
    const configObject = {
      defaultLabels: compareArray(config.defaultLabels),
      failoverLabels: compareArray(config.failoverLabels),
      labelsNotAllowed: compareArray(config.labelsNotAllowed),
      ignoreComments: compareBoolean(config.ignoreComments),
      includeTitle: compareBoolean(config.includeTitle),
      labelsSynonyms: compareObject(config.labelsSynonyms)
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
