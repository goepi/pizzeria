import { DataObject, StatusCode } from '../../server/types';
import { CallbackError } from '../../types/errors';
import { ShoppingCart } from '../../data/types';

export interface ShoppingCartsHandler {
  get: (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError | ShoppingCart) => void) => void;
}

// export const shoppingCartsHandler = {
//   get: (data, callback) => {},
// };
