class SyncUtil {
  async wait(ms: number): Promise<void> {
    return new Promise<void>((fulfill) => {
      setTimeout(() => {
        fulfill();
      }, ms);
    });
  }
}

export const syncUtil = new SyncUtil();
