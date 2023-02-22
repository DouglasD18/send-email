import { Queue } from './queue';

describe("Queue", () => {
  describe("size", () => {
    it("Should return 0 when Queue is just instancied", () => {
      const queue = new Queue();

      const result = queue.size();

      expect(result).toBe(0);
    })

    it("Should return 1 if Queue instance have just one item", () => {
      const queue = new Queue();

      queue.enqueue("");
      const result = queue.size();

      expect(result).toBe(1);
    })
  })

  describe("isEmpty", () => {
    it("Should return true when Queue is just instancied", () => {
      const queue = new Queue();

      const result = queue.isEmpty();

      expect(result).toBe(true);
    })

    it("Should return false if Queue instance is not empty", () => {
      const queue = new Queue();

      queue.enqueue("");
      const result = queue.isEmpty();

      expect(result).toBe(false);
    })
  })

  describe("enqueue", () => {
    it("Should insert one item at Queue", () => {
      const queue = new Queue();

      let isEmptyValue = queue.isEmpty();
      let sizeValue = queue.size();

      expect(isEmptyValue).toBe(true);
      expect(sizeValue).toBe(0);

      queue.enqueue("");
      isEmptyValue = queue.isEmpty();
      sizeValue = queue.size();

      expect(isEmptyValue).toBe(false);
      expect(sizeValue).toBe(1);
    })
  })

  describe("dequeue", () => {
    it("Should return undefined if Queue is empty", () => {
      const queue = new Queue();

      const result = queue.dequeue();

      expect(result).toBe(undefined);
    })

    it("Should delete always the first item in the Queue", () => {
      const queue = new Queue();

      queue.enqueue("First");
      queue.enqueue("Second");

      let sizeValue = queue.size();
      expect(sizeValue).toBe(2);

      const firstDequeue = queue.dequeue();
      sizeValue = queue.size()
      expect(firstDequeue).toBe("First");
      expect(sizeValue).toBe(1);

      const secondDequeue = queue.dequeue();
      sizeValue = queue.size()
      expect(secondDequeue).toBe("Second");
      expect(sizeValue).toBe(0);
    })
  })

  describe("peek", () => {
    it("Should return undefined if Queue is empty", () => {
      const queue = new Queue();

      const result = queue.peek();

      expect(result).toBe(undefined);
    })

    it("Should return always the first item in the Queue", () => {
      const queue = new Queue();

      queue.enqueue("First");
      queue.enqueue("Second");

      const result = queue.peek();
      expect(result).toBe("First");
    })
  })

  describe("clear", () => {
    it("Should clear the Queue", () => {
      const queue = new Queue();

      queue.enqueue("First");
      queue.enqueue("Second");
      queue.clear();
      const size = queue.size();

      expect(size).toBe(0);
    })
  })

  describe("toString", () => {
    it("Should return a string", () => {
      const queue = new Queue();

      const result = queue.toString();

      expect(typeof result).toBe("string");
    })

    it("Should the Queue's items like a string", () => {
      const queue = new Queue();

      queue.enqueue("First");
      queue.enqueue("Second");
      queue.enqueue("Third");

      const result = queue.toString();
      expect(result).toBe("First,Second,Third");
    })
  })
})