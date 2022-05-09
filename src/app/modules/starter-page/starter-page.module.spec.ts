import { StarterPageModule } from './starter-page.module';

describe('StarterPageModule', () => {
  let starterPageModule: StarterPageModule;

  beforeEach(() => {
    starterPageModule = new StarterPageModule();
  });

  it('should create an instance', () => {
    expect(starterPageModule).toBeTruthy();
  });
});
