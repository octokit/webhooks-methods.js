const AsyncFunctionConstructor = (async () => {}).constructor;

export function isAsyncFunction(
  fn: unknown,
): fn is (...args: unknown[]) => Promise<unknown> {
  return fn instanceof AsyncFunctionConstructor;
}
