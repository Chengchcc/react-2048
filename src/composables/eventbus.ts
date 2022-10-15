// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Eventbus<Handler extends (...args: any[]) => void> {
  readonly subscribers = new Map<string, Handler>()

  register(event: string, handler: Handler) {
    this.subscribers.set(event, handler)
    return () => {
      this.subscribers.delete(event)
    }
  }

  dispatch(event: string, ...args: Parameters<Handler>) {
    const handler = this.subscribers.get(event)
    if (handler) {
      handler(...args)
    }
  }

  broadcast(...args: Parameters<Handler>) {
    ;[...this.subscribers.values()].map((handler) => handler(args))
  }
}
