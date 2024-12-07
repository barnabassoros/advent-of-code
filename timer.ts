export class Timer {
  start?: DOMHighResTimeStamp;

  constructor() {}

  startTimer() {
    this.start = performance.now();
  }

  endTimer() {
    const end = performance.now();
    return end - this.start!;
  }
}
