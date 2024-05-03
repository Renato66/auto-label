export const removeLabelsNotAllowed = (
  labels: string[],
  labelsNotAllowed: string[]
): string[] => {
  if (!labelsNotAllowed || !labelsNotAllowed.length) {
    return labels
  }
  const labelsLC = labels.map(elem => elem.toLocaleLowerCase())
  const labelsNotAllowedLC = new Set(labelsNotAllowed.map(elem =>
    elem.toLocaleLowerCase()
  ))
  return labels.filter(
    (_, index) =>
      !labelsNotAllowedLC.has(labelsLC[index])
  )
}
