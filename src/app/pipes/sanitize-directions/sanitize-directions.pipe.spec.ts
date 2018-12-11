import { SanitizeDirectionsPipe } from './sanitize-directions.pipe';

describe('SanitizeDirectionsPipe', () => {
  it('create an instance', () => {
    const pipe = new SanitizeDirectionsPipe();
    expect(pipe).toBeTruthy();
  });
});
