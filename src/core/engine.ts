import { Frame, IPlaybackParser, IPlaybackRenderer } from './interfaces';

export type PlayerEvents = {
  onTimeUpdate?: (current: number, total: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
};

export class CorePlayerEngine {
  private parser: IPlaybackParser;
  private renderer: IPlaybackRenderer;
  private isPlaying = false;
  private currentTime = 0;
  private speed = 1.0;
  private startTimestamp = 0;
  private events: PlayerEvents = {};

  constructor(parser: IPlaybackParser, renderer: IPlaybackRenderer) {
    this.parser = parser;
    this.renderer = renderer;
  }

  setEvents(events: PlayerEvents) {
    this.events = events;
  }

  play() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.startTimestamp = performance.now() - this.currentTime;
      this.events.onPlay?.();
      this.tick();
    }
  }

  pause() {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.currentTime = this.getCurrentTime();
      this.events.onPause?.();
    }
  }

  async seek(time: number, autoPlay = false) {
    const target = Math.max(0, Math.min(time, this.getDuration()));
    this.pause();
    this.renderer.reset();
    const key = this.parser.getKeyFrameBefore(target);
    if (key) {
      this.renderer.renderFrame(key);
      this.currentTime = key.timestamp;
      const frames = await this.parser.load(key.timestamp, target);
      for (const f of frames) {
        if (f.timestamp <= target) {
          f.delta ? this.renderer.applyDelta(f) : this.renderer.renderFrame(f);
          this.currentTime = f.timestamp;
        }
      }
    } else {
      this.currentTime = 0;
    }
    this.events.onTimeUpdate?.(this.currentTime, this.getDuration());
    if (autoPlay) this.play();
  }

  setSpeed(rate: number) {
    this.speed = rate;
    if (this.isPlaying) {
      this.startTimestamp = performance.now() - this.currentTime;
    }
  }

  getCurrentTime(): number {
    if (!this.isPlaying) return this.currentTime;
    const elapsed = performance.now() - this.startTimestamp;
    this.currentTime = Math.min(elapsed * this.speed, this.getDuration());
    return this.currentTime;
  }

  getDuration(): number {
    return this.parser.getDuration();
  }

  private async tick() {
    if (!this.isPlaying) return;
    const now = this.getCurrentTime();
    this.events.onTimeUpdate?.(now, this.getDuration());
    const frames = await this.parser.load(this.currentTime, now);
    for (const frame of frames) {
      if (frame.timestamp <= now) {
        frame.delta ? this.renderer.applyDelta(frame) : this.renderer.renderFrame(frame);
        this.currentTime = frame.timestamp;
      }
    }
    if (now >= this.getDuration()) {
      this.isPlaying = false;
      this.events.onEnd?.();
      return;
    }
    requestAnimationFrame(() => this.tick());
  }
}
