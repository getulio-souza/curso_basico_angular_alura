import { PropertySummaryModule } from './property-summary.module';

describe('PropertySummaryModule', () => {
  let propertySummaryModule: PropertySummaryModule;

  beforeEach(() => {
    propertySummaryModule = new PropertySummaryModule();
  });

  it('should create an instance', () => {
    expect(PropertySummaryModule).toBeTruthy();
  });
});
