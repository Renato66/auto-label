// const nock = require('nock');
const path = require('path');

describe('Testing action functionalitie', () => {
  it('should find the labels', async () => {
    process.env['INPUT_ignore-comments'] = 'true';
    process.env['INPUT_labels-not-allowed'] = '[]';
    
    process.env['GITHUB_REPOSITORY'] = 'Renato66/auto-labels';
    process.env['GITHUB_EVENT_PATH'] = path.join(__dirname, 'payload.json');

    // nock('https://api.github.com')
    //   .persist()
    //   .post('/repos/Renato66/auto-labels/issues/1/comments', '{\"body\":\"hello\"}')
    //   .reply(200);
      
    const main = require('../src/main');

    await main.run();
  });
});
