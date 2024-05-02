export const removeLabelsNotAllowed = (
  labels: string[],
  labelsNotAllowed: string[]
): string[] => {
  if (!labelsNotAllowed || !labelsNotAllowed.length) {
    return labels
  }
  const labelsLC = labels.map(elem => elem.toLocaleLowerCase())
  const labelsNotAllowedLC = labelsNotAllowed.map(elem =>
    elem.toLocaleLowerCase()
  )
  return labels.filter(
    (_, index) =>
      !labelsNotAllowedLC.find(
        labelNotAllowed => labelNotAllowed === labelsLC[index]
      )
  )
}
