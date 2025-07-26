import { ImageSequenceParser } from '../src/plugins/image-sequence/parser';

describe('ImageSequenceParser', () => {
  it('returns duration based on last frame', () => {
    const parser = new ImageSequenceParser([
      { src: 'a.png', timestamp: 0 },
      { src: 'b.png', timestamp: 1000 },
    ]);
    expect(parser.getDuration()).toBe(1000);
  });
});
