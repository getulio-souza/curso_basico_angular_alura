import { UsageReportModule } from './usageReport.module';

describe('UsageReportModule', () => {
  let usageReportModule: UsageReportModule;

  beforeEach(() => {
    usageReportModule = new UsageReportModule();
  });

  it('should create an instance', () => {
    expect(usageReportModule).toBeTruthy();
  });
});
