import { RoomControlModule } from './room-control.module';

describe('RoomControlModule', () => {
  let roomControlModule: RoomControlModule;

  beforeEach(() => {
    roomControlModule = new RoomControlModule();
  });

  it('should create an instance', () => {
    expect(roomControlModule).toBeTruthy();
  });
});
