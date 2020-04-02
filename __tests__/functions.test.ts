import { compareLabels, getIssueLabels, getLabelsNotAllowed, getIgnoreComments, getLabelsSynonyms }  from '../src/functions'

describe('Testing compareLabels function', () => {
  // it('should find the labels', async () => {
  //   const hasLabels: Function = compareLabels(['THING','ITEM', 'FOO'])
  //   expect(hasLabels('test ITEM tesFOO testTHING')).toStrictEqual(['ITEM'])
  // })

  // it('should find the labels insensitive', async () => {
  //   const hasLabels: Function = compareLabels(['THING'])
  //   expect(hasLabels('test thing', ['THING'])).toStrictEqual(['THING'])
  // })

  // it('should find the exact word', async () => {
  //   const hasLabels: Function = compareLabels(['BUG'])
  //   expect(hasLabels('testing or debugin', ['BUG'])).toStrictEqual([])
  // })

  // it('should`t find the labels', async () => {
  //   const hasLabels: Function = compareLabels(['THING','ITEM', 'FOO'])
  //   expect(hasLabels('test')).toStrictEqual([])
  // })
  
  // it('should escape regex the labels', async () => {
  //   const hasLabels: Function = compareLabels(['Alocado', 'CLT', 'Especialista', 'Estágio', 'Falta de informações', 'Freela', 'Júnior', 'PJ', 'Pendente de informações', 'Pleno', 'Remoto', 'Stale', 'Sênior', '[Acre]', '[Alagoas]', '[Amapá]', '[Amazonas]', '[Bahia]', '[Brasilia]', '[Ceará]', '[Distrito Federal]', '[Espírito Santo]', '[Exterior]', '[Goiás]', '[Maranhão]', '[Mato Grosso do Sul]', '[Mato Grosso]', '[Minas Gerais]', '[Paraná]', '[Paraíba]'])
  //   const text = '**VAGA PROGRAMADOR ANGULAR/.NET – INÍCIO IMEDIATO** \r\n\r\n\r\nProgramador com **experiência em Angular e .Net** \r\n**Inicialmente trabalho remoto**\r\nPrazo: Indeterminado \r\n**Local: Empresa está localizada no Brooklin** \r\n\r\nContratação: Imediata\r\n\r\nInteressados enviar currículo para recrutamento@infovagas.com indicando no assunto “Programador Angular/.Net”\r\n'
  //   expect(hasLabels(text)).toStrictEqual(['Remoto'])
  // })

  it('should check the synonyms labels', async () => {
    process.env['INPUT_LABELS-SYNONYMS'] = `{"Something isn't working":["bug","error"]}`
    const hasLabels: Function = compareLabels(['Bug', `Something isn't working`])

    const text = 'There isn an error on system a \r\n\r\n\r\n **VAGA PROGRAMADOR ANGULAR/.NET – INÍCIO IMEDIATO** \r\n\r\n\r\nProgramador com **experiência em Angular e .Net** \r\n**Inicialmente trabalho remoto**'
    expect(hasLabels(text)).toStrictEqual([`Something isn't working`])
  })

})

// describe('Testing getIssueLabels function', () => {
//   it('should `new` label', async () => {
//     const body = `Testing new feature
//     not buggy
//     at all...`
//     const labels = ['bug', 'test', 'new']
//     expect(getIssueLabels(body, labels)).toStrictEqual(['new'])
//   })
// })

// describe('Testing getLabelsNotAllowed function', () => {
  
//   it('should return an empty array', async () => {
//     expect(getLabelsNotAllowed()).toStrictEqual([])
//   })

//   it('should return an empty array', async () => {
//     process.env['INPUT_LABELS-NOT-ALLOWED'] = `[]`
//     expect(getLabelsNotAllowed()).toStrictEqual([])
//   })

//   it('should return an array with `Stale` label', async () => {
//     process.env['INPUT_LABELS-NOT-ALLOWED'] = `["Stale"]`
//     expect(getLabelsNotAllowed()).toStrictEqual(['Stale'])
//   })

//   it('should return an array with `Stale`, `Remote` label', async () => {
//     process.env['INPUT_LABELS-NOT-ALLOWED'] = `["Stale", "Remote"]`
//     expect(getLabelsNotAllowed()).toStrictEqual(['Stale', 'Remote'])
//   })
  
// })

// describe('Testing getIgnoreComments function', () => {
  
//   it('should return default value: true', async () => {
//     expect(getIgnoreComments()).toStrictEqual(true)
//   })

//   it('should return value: true', async () => {
//     process.env['INPUT_IGNORE-COMMENTS'] = 'true'
//     expect(getIgnoreComments()).toStrictEqual(true)
//   })

//   it('should return value: false', async () => {
//     process.env['INPUT_IGNORE-COMMENTS'] = 'false'
//     expect(getIgnoreComments()).toStrictEqual(false)
//   })

// })

// describe('Testing getLabelsSynonyms function', () => {
  
//   it('should return default value: {}', async () => {
//     expect(getLabelsSynonyms()).toStrictEqual({})
//   })

//   it('should return value: true', async () => {
//     process.env['INPUT_LABELS-SYNONYMS'] = `{"Something isn't working":["error"]}`
//     expect(getLabelsSynonyms()).toStrictEqual({"Something isn't working":["error"]})
//   })

//   it('should return value: false', async () => {
//     process.env['INPUT_LABELS-SYNONYMS'] = `{}`
//     expect(getLabelsSynonyms()).toStrictEqual({})
//   })

// })
