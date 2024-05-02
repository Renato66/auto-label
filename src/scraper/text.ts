const escapeRegExp = (string: String): String => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

const compareLabels = (
  labels: string[],
  labelsSynonyms: Record<string, string[]>
): ((line: string) => string[]) => {
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

export const getIssueLabels = (
  body: string,
  labels: string[],
  ignoreComments: boolean,
  defaultLabels: string[],
  labelsSynonyms: Record<string, string[]>
): string[] => {
  const selectedLabels: string[] = []
  const hasLabels = compareLabels(labels, labelsSynonyms)

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
  return [...new Set([...selectedLabels, ...defaultLabels])]
}
