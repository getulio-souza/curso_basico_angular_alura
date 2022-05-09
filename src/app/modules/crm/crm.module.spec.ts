import { CRMModule } from './crm.module';

describe('CRMModule', () => {
  let crmModule: CRMModule;

  beforeEach(() => {
    crmModule = new CRMModule();
  });

  it('should create an instance', () => {
    expect(crmModule).toBeTruthy();
  });
});
