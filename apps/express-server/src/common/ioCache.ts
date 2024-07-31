class IOCache {
    private cache: Map<string, any>;
  
    constructor() {
      this.cache = new Map();
    }
  
    set(threadId: string, io: any): void {
      this.cache.set(threadId, io);
    }
  
    get(threadId: string): any | undefined {
      return this.cache.get(threadId);
    }
  
    delete(threadId: string): void {
      this.cache.delete(threadId);
    }
  }
  
  export const ioCache = new IOCache();