import { Frame, IPlaybackRenderer } from '../../core/interfaces';

export class CanvasImageRenderer implements IPlaybackRenderer {
  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;

  init(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;
  }

  renderFrame(frame: Frame) {
    if (!this.ctx || !(frame.data instanceof HTMLImageElement)) return;
    this.resize(frame.data);
    this.ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    this.ctx.drawImage(frame.data, 0, 0);
  }

  applyDelta(frame: Frame) {
    this.renderFrame(frame);
  }

  reset() {
    if (this.canvas && this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
    this.canvas = undefined;
    this.ctx = undefined;
  }

  private resize(img: HTMLImageElement) {
    if (!this.canvas) return;
    this.canvas.width = img.naturalWidth;
    this.canvas.height = img.naturalHeight;
  }
}
