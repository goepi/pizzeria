export const isValidMethodForHandler = <T>(handler: T) => (method: string): method is Extract<keyof T, string> =>
  Object.keys(handler).indexOf(method) !== -1;
