import { ShoppingCart } from '../../data/types';
import { ParsedRequest } from '../../server/helpers';
import { StatusCode } from '../../server/types';
import { CallbackError } from '../../types/errors';

export interface ShoppingCartsHandler {
  get: (
    data: ParsedRequest,
    callback: (statusCode: StatusCode, payload?: CallbackError | ShoppingCart) => void
  ) => void;
}

// export const shoppingCartsHandler = {
//   get: (data, callback) => {},
// };
