import { IPlaybackPlugin } from '../../core/interfaces';
import { ImageSequenceParser, ImageFrameMeta } from './parser';
import { CanvasImageRenderer } from './renderer';

export const ImageSequencePlugin: IPlaybackPlugin = {
  id: 'image-sequence',
  test(data: ArrayBuffer) {
    // simple detection: check prefix 'VIMG' or just return true for demo
    const magic = new TextDecoder().decode(data.slice(0, 4));
    return magic === 'VIMG';
  },
  async createParser(data: ArrayBuffer) {
    // demo: assume JSON metadata after first 4 bytes
    const json = new TextDecoder().decode(data.slice(4));
    const metas: ImageFrameMeta[] = JSON.parse(json);
    return new ImageSequenceParser(metas);
  },
  createRenderer() {
    return new CanvasImageRenderer();
  },
};

export default ImageSequencePlugin;
