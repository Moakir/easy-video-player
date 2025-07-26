export type Frame = {
  timestamp: number;
  keyframe: boolean;
  delta: boolean;
  data: Uint8Array | string | any;
};

export interface IPlaybackParser {
  load(timeStart: number, timeEnd: number): Promise<Frame[]>;
  getDuration(): number;
  getKeyFrameBefore(time: number): Frame | null;
}

export interface IPlaybackRenderer {
  init(container: HTMLElement): void;
  renderFrame(frame: Frame): void;
  applyDelta(frame: Frame): void;
  reset(): void;
}

export interface IPlaybackPlugin {
  id: string;
  test(data: ArrayBuffer): boolean;
  createParser(data: ArrayBuffer): Promise<IPlaybackParser> | IPlaybackParser;
  createRenderer(): IPlaybackRenderer;
}
