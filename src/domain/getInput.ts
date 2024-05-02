import * as core from '@actions/core'

const getObjectInput = <T>(field: string, fallback: T): T => {
  const inputString = core.getInput(field)
  if (!inputString) return fallback
  try {
    return JSON.parse(inputString) as T
  } catch (error: any) {
    throw new Error(`"${field}": ${error.message}`)
  }
}
const getBooleanInput = (field: string, fallback: boolean): boolean => {
  if([undefined, ''].includes(core.getInput(field, { trimWhitespace: true }))) return fallback
  return core.getBooleanInput(field)
}

export const getInput = <T>(field: string, fallback: T): T => {
  switch (typeof fallback) {
    case 'object':
      return getObjectInput(field, fallback)
    case 'boolean':
      return getBooleanInput(field, fallback) as T
    default:
      return core.getInput(field) as T
  }
}