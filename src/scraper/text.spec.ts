import { expect, describe, test } from 'bun:test'
import { getIssueLabels } from './text'

describe('getIssueLabels function', () => {
  test('should return an array of labels extracted from body', () => {
    const body =
      'Body with labels <!-- AUTO-LABEL:START --> Label1 Label2 <!-- AUTO-LABEL:END -->'
    const labels = ['Label1', 'Label2']

    const result = getIssueLabels(body, labels, false, [], {})

    expect(result).toEqual(['Label1', 'Label2'])
  })

  test('should handle no labels in body', () => {
    const body = 'No labels in this body'
    const labels = ['Label1', 'Label2']
    const result = getIssueLabels(body, labels, false, [], {})

    expect(result).toEqual([])
  })

  test('should add default labels', () => {
    const body = 'No labels in this body'
    const labels = ['Label1', 'Label2']
    const defaultLabels = ['DefaultLabel1', 'DefaultLabel2']

    const result = getIssueLabels(body, labels, false, defaultLabels, {})

    expect(result).toEqual(['DefaultLabel1', 'DefaultLabel2'])
  })

  test('should not add labels inside the comments section', () => {
    const body =
      'Body with labels: Label1  <!-- the label Label2 is mentioned in the body, but its commented and shouldn`t be tracked -->'
    const labels = ['Label1', 'Label2']

    const result = getIssueLabels(body, labels, true, [], {})

    expect(result).toEqual(['Label1'])
  })

  test('should check if there is any synonym for the labels available', () => {
    const body =
      'Body with labels: Synonym1  <!-- the label Synonym2 is mentioned in the body, but its commented and shouldn`t be tracked -->'
    const labels = ['Label1', 'Label2']
    const labelsSynonyms = { Label1: ['Synonym1'], Label2: ['Synonym2'] }

    const result = getIssueLabels(body, labels, true, [], labelsSynonyms)

    expect(result).toEqual(['Label1'])
  })
})
