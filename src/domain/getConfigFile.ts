import { getInput } from './getInput'
import { getLabelConfigs } from './getLabelConfigs'

export type Config = {
  labelsNotAllowed: string[]
  defaultLabels: string[]
  failoverLabels: string[]
  labelsSynonyms: Record<string, string[]>
  ignoreComments: boolean
  includeTitle: boolean
}

export const getConfigFile = (): Config => {
  const configPath = getInput<string>(
    'configuration-file',
    '.github/workflows/'
  )
  const labelsNotAllowed = getInput<string[]>('labels-not-allowed', [])
  const defaultLabels = getInput<string[]>('default-labels', [])
  const failoverLabels = getInput<string[]>('failover-labels', [])
  const labelsSynonyms = getInput<Record<string, string[]>>(
    'labels-synonyms',
    {}
  )
  const ignoreComments = getInput('ignore-comments', true)
  const includeTitle = getInput('include-title', true)
  const config = getLabelConfigs(configPath)

  return {
    labelsNotAllowed,
    defaultLabels,
    labelsSynonyms,
    ignoreComments,
    includeTitle,
    failoverLabels,
    ...config
  }
}
