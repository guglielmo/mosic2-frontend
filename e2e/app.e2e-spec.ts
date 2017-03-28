import { MOSIC.CliPage } from './app.po';

describe('mosic.cli App', () => {
  let page: MOSIC.CliPage;

  beforeEach(() => {
    page = new MOSIC.CliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
