import { ProxperCommonModule } from './proxperCommon.module';

describe('ProxperCommonModule', () => {
  let proxperCommonModule: ProxperCommonModule;

  beforeEach(() => {
    proxperCommonModule = new ProxperCommonModule();
  });

  it('should create an instance', () => {
    expect(proxperCommonModule).toBeTruthy();
  });
});
