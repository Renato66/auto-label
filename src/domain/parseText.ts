export const parseText = (
  body: string,
  title: string,
  ignoreComments?: boolean,
  includeTitle?: boolean
): string => {
  let parsedBody = body
  if (parsedBody.includes('AUTO-LABEL:START')) {
    const [_ignore, ...bodySplit] = body.split('AUTO-LABEL:START')
    parsedBody = bodySplit
      .map((elem) => elem.split('AUTO-LABEL:END')[0])
      .join(' ')
  }

  if (ignoreComments && parsedBody.includes('<!--')) {
    parsedBody = parsedBody.replace(/\<!--(.|\n)*?-->/g, '')
  }

  const response = [parsedBody]

  if (includeTitle) {
    response.unshift(title)
  }

  return response.join(' ')
}
