import { getInput } from './getInput'
import { getLabelConfigs } from './getLabelConfigs'

export type Config = {
  labelsNotAllowed: string[]
  defaultLabels: string[]
  labelsSynonyms: Record<string, string[]>
  ignoreComments: boolean
}

export const getConfigFile = (): Config => {
  const configPath = getInput<string>(
    'configuration-file',
    '.github/workflows/'
  )
  const labelsNotAllowed = getInput<string[]>('labels-not-allowed', [])
  const defaultLabels = getInput<string[]>('default-labels', [])
  const labelsSynonyms = getInput<Record<string, string[]>>(
    'labels-synonyms',
    {}
  )
  const ignoreComments = getInput('ignore-comments', true)
  const config = getLabelConfigs(configPath)

  return {
    labelsNotAllowed,
    defaultLabels,
    labelsSynonyms,
    ignoreComments,
    ...config
  }
}
