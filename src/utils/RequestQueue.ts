/**
 * RequestQueue - Manages sequential execution of async requests
 *
 * This queue ensures that requests are processed one at a time,
 * preventing race conditions when multiple requests try to modify
 * the same resource concurrently.
 *
 * Usage:
 * const queue = new RequestQueue();
 * await queue.add(() => apiCall());
 */
export class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;

  /**
   * Add a request to the queue
   * @param request - Async function to execute
   * @returns Promise that resolves with the request result
   */
  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  /**
   * Process all requests in the queue sequentially
   */
  private async processQueue() {
    this.processing = true;

    while (this.queue.length > 0) {
      const request = this.queue.shift()!;
      await request();
    }

    this.processing = false;
  }

  /**
   * Get the current queue size
   */
  get size(): number {
    return this.queue.length;
  }

  /**
   * Check if queue is currently processing
   */
  get isProcessing(): boolean {
    return this.processing;
  }
}
