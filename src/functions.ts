const escapeRegExp: Function = (string: String): String => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
const compareLabels: Function = (labels: string[]): Function => {
  const labelsRegex = new RegExp(labels.map(elem => `\\b${escapeRegExp(elem)}\\b`).join('|'), 'gi')
  const hasLabels = (line: string): string[] => {
    const selectedLabels = line.match(labelsRegex) || []
    return selectedLabels.map(elem => {
      return labels.find(label => label.toLowerCase() === elem.toLowerCase()) || elem
    }) 
  }
  return hasLabels
}

const getIssueLabels: Function = (body: string, labels: string[], ignoreComments: boolean): string[] => {
  let selectedLabels: string[] = []
  let hasLabels: Function = compareLabels(labels)

  if (ignoreComments) {
    let comentary: boolean = false
    body.split('\n').forEach((line: string) => {
      if (line.includes('<!--')) {
        comentary = true
      } if (line.includes('-->')) {
        comentary = false
      }
      if (!comentary) {
        hasLabels(line).map(elem => {
          selectedLabels.push(elem)
        })
      }
    })
  } else {
    hasLabels(body).map(elem => {
      selectedLabels.push(elem)
    })
  }
  
  return [...new Set(selectedLabels)]
}

export {
  compareLabels,
  getIssueLabels
}