import { NPSModule } from './nps.module';

describe('NPSModule', () => {
  let orderModule: NPSModule;

  beforeEach(() => {
    orderModule = new NPSModule();
  });

  it('should create an instance', () => {
    expect(orderModule).toBeTruthy();
  });
});
