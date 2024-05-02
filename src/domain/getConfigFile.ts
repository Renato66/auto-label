import { getInput } from "./getInput"

export const getConfigFile = () => {
  const labelsNotAllowed = getInput<string[]>('labels-not-allowed', [])
  const defaultLabels = getInput<string[]>('default-labels', [])
  const labelsSynonyms =  getInput<Record<string, string[]>>('labels-synonyms', {})
  const ignoreComments = getInput('ignore-comments', true)

  return {
    labelsNotAllowed,
    defaultLabels,
    labelsSynonyms,
    ignoreComments
  }
}
