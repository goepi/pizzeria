import { dataInterface } from '../../data';
import { Order } from '../../data/types';
import { ParsedRequest } from '../../server/helpers';
import { StatusCode } from '../../server/types';
import { CallbackError } from '../../types/errors';
import { helpers } from '../../utils/cryptography';
import { getMenu, validateTokenId, validateUsername } from '../../utils/requestValidation';
import { Cart } from '../carts';
import { makePayment } from '../payment';
import { verifyToken } from '../tokens/helpers';

const debug = Debug('app:orders');

export const ordersHandler = {
  post: (data: ParsedRequest, callback: (statusCode: StatusCode, payload?: CallbackError | Cart) => void) => {
    const id = validateTokenId(data.headers.token);
    const username = validateUsername(data.pathVariables && data.pathVariables.username);

    if (id && username) {
      verifyToken(id, username, isTokenValid => {
        if (isTokenValid) {
          dataInterface.read('users', username, (userErr, userData) => {
            if (!userErr && userData) {
              calculateCartPaymentAmount(userData.cart, (amount: number | false) => {
                if (amount) {
                  createOrder(username, userData.cart, amount, (err: boolean, id?: string) => {
                    if (!err && id) {
                      makePayment(amount, 'usd', (paymentErr: CallbackError | false) => {
                        if (!paymentErr) {
                          updateOrder(id, { paid: true }, (updateErr, updatedOrder) => {
                            if (!err) {
                              // success
                            } else {
                              // issue updating db
                            }
                          });
                          callback(200);
                        } else {
                          callback(500, { error: 'Error processing payment.' });
                        }
                      });
                    } else {
                      callback(500, { error: 'Error processing payment.' });
                    }
                  });
                } else {
                  callback(500, { error: 'Error processing payment.' });
                }
              });
            } else {
              callback(400, { error: 'No user for this token.' });
            }
          });
        } else {
          callback(403, { error: 'Invalid token.' });
        }
      });
    } else {
      callback(403, { error: 'Invalid request parameters.' });
    }
  },
};

const createOrder = (username: string, cart: Cart, price: number, callback: (err: boolean, id?: string) => void) => {
  const id = helpers.createRandomString(20);

  if (id) {
    const newOrder: Order = {
      id,
      username,
      cart,
      price,
      paid: false,
    };
    dataInterface.create('orders', id, newOrder, (err: CallbackError | false) => {
      if (!err) {
        callback(false, id);
      } else {
        callback(true);
      }
    });
  } else {
    callback(true);
  }
};

const updateOrder = (id: string, order: Partial<Order>, callback: (err: boolean, order?: Order) => void) => {
  dataInterface.read('orders', id, (readErr, oldOrder) => {
    if (!readErr && oldOrder) {
      const newOrder = {
        ...oldOrder,
        ...order,
      };
      dataInterface.update('orders', id, newOrder, updateErr => {
        if (!updateErr) {
          callback(false, newOrder);
        } else {
          callback(true);
        }
      });
    } else {
      callback(true);
    }
  });
};

const calculateCartPaymentAmount = (cart: Cart, callback: (amount: number | false) => void) => {
  getMenu(menu => {
    if (menu) {
      const total = Object.keys(cart).reduce((acc, id) => (acc += cart[id] * menu[id].price), 0);
      debug(total);
      callback(total);
    } else {
      callback(false);
    }
  });
};
