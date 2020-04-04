import { compareLabels, getIssueLabels, getLabelsNotAllowed, getIgnoreComments, getLabelsSynonyms, getDefaultLabels }  from '../src/functions'

beforeEach(() => {
  delete process.env['INPUT_DEFAULT-LABELS']
  delete process.env['INPUT_LABELS-NOT-ALLOWED']
  delete process.env['INPUT_IGNORE-COMMENTS']
  delete process.env['INPUT_LABELS-SYNONYMS']
})

describe('Testing compareLabels function', () => {
  it('should find the labels', async () => {
    const hasLabels: Function = compareLabels(['THING','ITEM', 'FOO'])
    expect(hasLabels('test ITEM tesFOO testTHING')).toStrictEqual(['ITEM'])
  })

  it('should find the labels insensitive', async () => {
    const hasLabels: Function = compareLabels(['THING'])
    expect(hasLabels('test thing', ['THING'])).toStrictEqual(['THING'])
  })

  it('should find the exact word', async () => {
    const hasLabels: Function = compareLabels(['BUG'])
    expect(hasLabels('testing or debugin', ['BUG'])).toStrictEqual([])
  })

  it('should`t find the labels', async () => {
    const hasLabels: Function = compareLabels(['THING','ITEM', 'FOO'])
    expect(hasLabels('test')).toStrictEqual([])
  })
  
  it('should escape regex the labels', async () => {
    const hasLabels: Function = compareLabels(['Alocado', 'CLT', 'Especialista', 'Estágio', 'Falta de informações', 'Freela', 'Júnior', 'PJ', 'Pendente de informações', 'Pleno', 'Remoto', 'Stale', 'Sênior', '[Acre]', '[Alagoas]', '[Amapá]', '[Amazonas]', '[Bahia]', '[Brasilia]', '[Ceará]', '[Distrito Federal]', '[Espírito Santo]', '[Exterior]', '[Goiás]', '[Maranhão]', '[Mato Grosso do Sul]', '[Mato Grosso]', '[Minas Gerais]', '[Paraná]', '[Paraíba]'])
    const text = '**VAGA PROGRAMADOR ANGULAR/.NET – INÍCIO IMEDIATO** \r\n\r\n\r\nProgramador com **experiência em Angular e .Net** \r\n**Inicialmente trabalho remoto**\r\nPrazo: Indeterminado \r\n**Local: Empresa está localizada no Brooklin** \r\n\r\nContratação: Imediata\r\n\r\nInteressados enviar currículo para recrutamento@infovagas.com indicando no assunto “Programador Angular/.Net”\r\n'
    expect(hasLabels(text)).toStrictEqual(['Remoto'])
  })

  it('should check the synonyms labels', async () => {
    process.env['INPUT_LABELS-SYNONYMS'] = `{"Something isn't working":["bug","error"]}`
    const hasLabels: Function = compareLabels(['Bug', `Something isn't working`])

    const text = 'There isn an error on system a \r\n\r\n\r\n **VAGA PROGRAMADOR ANGULAR/.NET – INÍCIO IMEDIATO** \r\n\r\n\r\nProgramador com **experiência em Angular e .Net** \r\n**Inicialmente trabalho remoto**'
    expect(hasLabels(text)).toStrictEqual([`Something isn't working`])
  })

})

describe('Testing getIssueLabels function', () => {
  it('should `new` label', async () => {
    process.env['INPUT_IGNORE-COMMENTS'] = 'false'
    const body = `Testing new feature
    not buggy
    at all... <!-- attention -->`
    const labels = ['bug', 'test', 'new']
    expect(getIssueLabels(body, labels)).toStrictEqual(['new'])
  })

  it('should not add `new` label', async () => {
    const labels = ['bug', 'test', 'new']
    const body = `There is an error on system a \r\n\r\n\r\n **VAGA PROGRAMADOR ANGULAR/.NET –n\r\n\r\n <!-- new -->`
    const body2 = `There is an error on system a \r\n\r\n\r\n **VAGA PROGRAMADOR ANGULAR/.NET –n\r\n\r\n <!--\n\n restes\n new \n-->`
    const body3 = `There is an bug on system a \r\n\r\n\r\n **VAGA PROGRAMADOR ANGULAR/.NET –n\r\n\r\n <!--\n\n restes\n new \n-->`
    expect(getIssueLabels(body, labels)).toStrictEqual([])
    expect(getIssueLabels(body2, labels)).toStrictEqual([])
    expect(getIssueLabels(body3, labels)).toStrictEqual(['bug'])
  })

  it('should return default label', async () => {
    process.env['INPUT_DEFAULT-LABELS'] = `["triage"]`
    const body = `There is an error on system a \r\n\r\n\r\n **VAGA PROGRAMADOR ANGULAR/.NET –n\r\n\r\n <!-- new -->`
    const labels = ['bug', 'test', 'new', 'triage']
    expect(getIssueLabels(body, labels)).toStrictEqual(['triage'])
  })

  it('should return bug as text `error` is a synonym', async () => {
    process.env['INPUT_LABELS-SYNONYMS'] = `{"bug":["error"]}`
    const body = `There is an error on system a \r\n\r\n\r\n **VAGA PROGRAMADOR ANGULAR/.NET –n\r\n\r\n <!-- new -->`
    const labels = ['bug', 'test', 'new']
    expect(getIssueLabels(body, labels)).toStrictEqual(['bug'])
  })
 
})

describe('Testing getLabelsNotAllowed function', () => {
  
  it('should return an empty array', async () => {
    expect(getLabelsNotAllowed()).toStrictEqual([])
  })

  it('should return an empty array', async () => {
    process.env['INPUT_LABELS-NOT-ALLOWED'] = `[]`
    expect(getLabelsNotAllowed()).toStrictEqual([])
  })

  it('should return an array with `Stale` label', async () => {
    process.env['INPUT_LABELS-NOT-ALLOWED'] = `["Stale"]`
    expect(getLabelsNotAllowed()).toStrictEqual(['Stale'])
  })

  it('should return an array with `Stale`, `Remote` label', async () => {
    process.env['INPUT_LABELS-NOT-ALLOWED'] = `["Stale", "Remote"]`
    expect(getLabelsNotAllowed()).toStrictEqual(['Stale', 'Remote'])
  })
  
})

describe('Testing getIgnoreComments function', () => {
  
  it('should return default value: true', async () => {
    expect(getIgnoreComments()).toStrictEqual(true)
  })

  it('should return value: true', async () => {
    process.env['INPUT_IGNORE-COMMENTS'] = 'true'
    expect(getIgnoreComments()).toStrictEqual(true)
  })

  it('should return value: false', async () => {
    process.env['INPUT_IGNORE-COMMENTS'] = 'false'
    expect(getIgnoreComments()).toStrictEqual(false)
  })

})

describe('Testing getLabelsSynonyms function', () => {
  
  it('should return default value: {}', async () => {
    expect(getLabelsSynonyms()).toStrictEqual({})
  })

  it('should return value: true', async () => {
    process.env['INPUT_LABELS-SYNONYMS'] = `{"Something isn't working":["error"]}`
    expect(getLabelsSynonyms()).toStrictEqual({"Something isn't working":["error"]})
  })

  it('should return value: false', async () => {
    process.env['INPUT_LABELS-SYNONYMS'] = `{}`
    expect(getLabelsSynonyms()).toStrictEqual({})
  })

})

describe('Testing getDefaultLabels function', () => {
  
  it('should return an empty array', async () => {
    expect(getDefaultLabels()).toStrictEqual([])
  })

  it('should return an empty array', async () => {
    process.env['INPUT_DEFAULT-LABELS'] = `[]`
    expect(getDefaultLabels()).toStrictEqual([])
  })

  it('should return an array with `triage` label', async () => {
    process.env['INPUT_DEFAULT-LABELS'] = `["triage"]`
    expect(getDefaultLabels()).toStrictEqual(['triage'])
  })

  it('should return an array with `triage`, `verify` label', async () => {
    process.env['INPUT_DEFAULT-LABELS'] = `["triage", "verify"]`
    expect(getDefaultLabels()).toStrictEqual(['triage', 'verify'])
  })
  
})