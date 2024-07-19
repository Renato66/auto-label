import { expect, describe, test } from 'bun:test'
import { parseText } from './parseText'

describe('getIssueLabels function', () => {
  test('should return just scoped body', () => {
    const body =
      'Body with labels <!-- AUTO-LABEL:START --> Label1 Label2 <!-- AUTO-LABEL:END -->'
    const result = parseText(body, '', false, false)

    expect(result).toEqual(' --> Label1 Label2 <!-- ')
  })

  test('should return just scoped body', () => {
    const body =
      'Body with labels <!-- Label3 --> Label1 Label2'
    const result = parseText(body, '', true, false)

    expect(result).toEqual('Body with labels  Label1 Label2')
  })

  test('should return just scoped body', () => {
    const body =
      'Body with labels <!-- Label3 --> Label1 Label2'
    const result = parseText(body, 'Title', true, true)

    expect(result).toEqual('Title Body with labels  Label1 Label2')
  })
})
