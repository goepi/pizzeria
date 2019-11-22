import { router } from './index';

type ValidTrimmedPath = keyof typeof router;

export const isPathValid = (trimmedPath: string): trimmedPath is ValidTrimmedPath =>
  Object.keys(router).indexOf(trimmedPath) !== -1;

export const isValidMethodForHandler = <T>(handler: T) => (method: string): method is Extract<keyof T, string> =>
  Object.keys(handler).indexOf(method) !== -1;
