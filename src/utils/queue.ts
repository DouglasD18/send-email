export class Queue {
  private count: number;
  private lowestCount: number;
  private items: object;

  constructor() {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }

  size(): number {
    return this.count - this.lowestCount;
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  enqueue(element: any): void {
    this.items[this.count] = element;
    this.count += 1;
  }

  dequeue(): any {
    if (this.isEmpty()) {
      return undefined;
    }

    const result = this.items[this.lowestCount];
    delete this.items[this.lowestCount];
    this.lowestCount += 1;
    return result;
  }

  peek(): any {
    if (this.isEmpty()) {
      return undefined;
    }

    return this.items[this.lowestCount];
  }

  clear(): void {
    this.items = {};
    this.lowestCount = 0;
    this.count = 0;
  }

  toString(): string {
    if (this.isEmpty()) {
      return '';
    }

    let objString = `${this.items[this.lowestCount]}`;
    for (let index = this.lowestCount + 1; index < this.count; index++) {
      objString = `${objString},${this.items[index]}`;
    }

    return objString;
  }
}