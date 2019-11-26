import { ShoppingCart } from '../../data/types';
import { DataObject, StatusCode } from '../../server/types';
import { CallbackError } from '../../types/errors';

export interface ShoppingCartsHandler {
  get: (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError | ShoppingCart) => void) => void;
}

// export const shoppingCartsHandler = {
//   get: (data, callback) => {},
// };
