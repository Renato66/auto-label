import * as core from '@actions/core'

const escapeRegExp = (string: String): String => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

const compareLabels = (labels: string[]): ((line: string) => string[]) => {
  const labelsSynonyms = getLabelsSynonyms()
  const hasSynonyms = Object.keys(labelsSynonyms).length !== 0
  if (hasSynonyms) {
    const labelsRegex = new RegExp(
      labels
        .map(elem => {
          if (labelsSynonyms[elem] === undefined) {
            return `\\b${escapeRegExp(elem)}\\b`
          } else {
            return [elem, ...labelsSynonyms[elem]]
              .map(synonym => `\\b${escapeRegExp(synonym)}\\b`)
              .join('|')
          }
        })
        .join('|'),
      'gi'
    )
    let synonymsObject: Record<string, string> = {}
    for (let label in labelsSynonyms) {
      labelsSynonyms[label].forEach(synonym => {
        synonymsObject[synonym.toLowerCase()] = label
      })
    }
    const hasLabels = (line: string): string[] => {
      const selectedLabels = line.match(labelsRegex) || []
      return selectedLabels.map(elem => {
        return (
          synonymsObject[elem.toLowerCase()] ||
          labels.find(label => label.toLowerCase() === elem.toLowerCase()) ||
          elem
        )
      })
    }
    return hasLabels
  } else {
    const labelsRegex = new RegExp(
      labels.map(elem => `\\b${escapeRegExp(elem)}\\b`).join('|'),
      'gi'
    )
    const hasLabels = (line: string): string[] => {
      const selectedLabels = line.match(labelsRegex) || []
      return selectedLabels.map(elem => {
        return (
          labels.find(label => label.toLowerCase() === elem.toLowerCase()) ||
          elem
        )
      })
    }
    return hasLabels
  }
}

const parseAutoLabel = (body: string): string => {
  const autoLabelRegex = new RegExp(
    /<!-- AUTO-LABEL:START -->(?<label>(\s*\w.+|\n)*?)\s*<!-- AUTO-LABEL:END -->/,
    'gm'
  )
  const autoLabels = body.match(autoLabelRegex)

  if (!autoLabels) return body

  const replaceAutoLabelByLabelValue = (autoLabel: string) =>
    autoLabel.replace(autoLabelRegex, '$1').trim()

  return autoLabels.map(replaceAutoLabelByLabelValue).join(' ')
}

const getIssueLabels = (body: string, labels: string[]): string[] => {
  let selectedLabels: string[] = []
  let hasLabels = compareLabels(labels)
  const ignoreComments = getIgnoreComments()

  const parsedBody = parseAutoLabel(body)

  if (ignoreComments) {
    const noCommentaryBody = parsedBody.replace(/\<!--(.|\n)*?-->/g, '')
    hasLabels(noCommentaryBody).map(elem => {
      selectedLabels.push(elem)
    })
  } else {
    hasLabels(parsedBody).map(elem => {
      selectedLabels.push(elem)
    })
  }
  const defaultLabels = getDefaultLabels()
  return [...new Set([...selectedLabels, ...defaultLabels])]
}

const getLabelsNotAllowed = (): string[] => {
  return core.getInput('labels-not-allowed')
    ? JSON.parse(core.getInput('labels-not-allowed'))
    : []
}

const getLabelsSynonyms = (): Record<string, string[]> => {
  return core.getInput('labels-synonyms')
    ? JSON.parse(core.getInput('labels-synonyms'))
    : {}
}

const getIgnoreComments = (): boolean => {
  return core.getInput('ignore-comments')
    ? core.getInput('ignore-comments') === 'true'
    : true
}

const getDefaultLabels = (): string[] => {
  return core.getInput('default-labels')
    ? JSON.parse(core.getInput('default-labels'))
    : []
}

export {
  compareLabels,
  getIssueLabels,
  getLabelsNotAllowed,
  getLabelsSynonyms,
  getIgnoreComments,
  getDefaultLabels
}
