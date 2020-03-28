const { compareLabels, getIssueLabels } = require('../src/functions.ts')

describe('Testing compareLabels function', () => {
  it('should find the labels', async () => {
    const hasLabels: Function = compareLabels(['THING','ITEM', 'FOO'])
    expect(hasLabels('test ITEM tesFOO testTHING')).toStrictEqual(['ITEM']);
  });

  it('should find the labels insensitive', async () => {
    const hasLabels: Function = compareLabels(['THING'])
    expect(hasLabels('test thing', ['THING'])).toStrictEqual(['THING']);
  });

  it('should find the exact word', async () => {
    const hasLabels: Function = compareLabels(['BUG'])
    expect(hasLabels('testing or debugin', ['BUG'])).toStrictEqual([]);
  });

  it('should`t find the labels', async () => {
    const hasLabels: Function = compareLabels(['THING','ITEM', 'FOO'])
    expect(hasLabels('test')).toStrictEqual([]);
  });
  
  it('should escape regex the labels', async () => {
    const hasLabels: Function = compareLabels(['Alocado', 'CLT', 'Especialista', 'Estágio', 'Falta de informações', 'Freela', 'Júnior', 'PJ', 'Pendente de informações', 'Pleno', 'Remoto', 'Stale', 'Sênior', '[Acre]', '[Alagoas]', '[Amapá]', '[Amazonas]', '[Bahia]', '[Brasilia]', '[Ceará]', '[Distrito Federal]', '[Espírito Santo]', '[Exterior]', '[Goiás]', '[Maranhão]', '[Mato Grosso do Sul]', '[Mato Grosso]', '[Minas Gerais]', '[Paraná]', '[Paraíba]'])
    const text = '**VAGA PROGRAMADOR ANGULAR/.NET – INÍCIO IMEDIATO** \r\n\r\n\r\nProgramador com **experiência em Angular e .Net** \r\n**Inicialmente trabalho remoto**\r\nPrazo: Indeterminado \r\n**Local: Empresa está localizada no Brooklin** \r\n\r\nContratação: Imediata\r\n\r\nInteressados enviar currículo para recrutamento@infovagas.com indicando no assunto “Programador Angular/.Net”\r\n'
    expect(hasLabels(text)).toStrictEqual(['Remoto']);
  });
  
});
describe('Testing getIssueLabels function', () => {
  it('should `new` label', async () => {
    const body = `Testing new feature
    not buggy
    at all...`
    const labels = ['bug', 'test', 'new']
    expect(getIssueLabels(body, labels, false)).toStrictEqual(['new']);
  });
});