import { Frame, IPlaybackParser } from '../../core/interfaces';

export interface ImageFrameMeta {
  src: string;
  timestamp: number;
}

export class ImageSequenceParser implements IPlaybackParser {
  private frames: ImageFrameMeta[] = [];
  private images: Map<number, HTMLImageElement> = new Map();

  constructor(metas: ImageFrameMeta[]) {
    this.frames = metas.sort((a, b) => a.timestamp - b.timestamp);
  }

  async load(start: number, end: number): Promise<Frame[]> {
    const result: Frame[] = [];
    for (const meta of this.frames) {
      if (meta.timestamp >= start && meta.timestamp <= end) {
        const img = await this.loadImage(meta.src);
        result.push({
          timestamp: meta.timestamp,
          keyframe: true,
          delta: false,
          data: img,
        });
      }
    }
    return result;
  }

  getDuration(): number {
    return this.frames.length ? this.frames[this.frames.length - 1].timestamp : 0;
  }

  getKeyFrameBefore(time: number): Frame | null {
    let frame: Frame | null = null;
    for (const meta of this.frames) {
      if (meta.timestamp <= time) {
        frame = {
          timestamp: meta.timestamp,
          keyframe: true,
          delta: false,
          data: this.images.get(meta.timestamp) ?? meta.src,
        };
      } else {
        break;
      }
    }
    return frame;
  }

  private async loadImage(src: string): Promise<HTMLImageElement> {
    const existing = Array.from(this.images.values()).find((img) => img.src === src);
    if (existing) return existing;
    const img = new Image();
    img.src = src;
    await img.decode().catch(() => {});
    const meta = this.frames.find(f => f.src === src);
    if (meta) this.images.set(meta.timestamp, img);
    return img;
  }
}
