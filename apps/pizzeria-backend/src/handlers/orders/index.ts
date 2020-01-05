import Debug from 'debug';
import { dataInterface } from '../../data';
import { Order, UserOrders } from '../../data/types';
import { HandlerCallback } from '../../router/types';
import { ParsedRequest, StatusCode } from '../../server/types';
import { CallbackError } from '../../types/errors';
import { helpers } from '../../utils/cryptography';
import { getMenu, validateTokenId, validateUsername } from '../../utils/requestValidation';
import { addUserOrder, Cart, resetUserCart } from '../carts';
import { sendSuccessfulOrderEmail } from '../mail';
import { makePayment } from '../payment';
import { verifyToken } from '../tokens/helpers';

const debug = Debug('app:orders');

export const ordersHandler = {
  get: (data: ParsedRequest, callback: HandlerCallback<Order[]>) => {
    const id = validateTokenId(data.headers.token);
    const username = validateUsername(data.pathVariables && data.pathVariables.username);

    if (id && username) {
      verifyToken(id, username, isTokenValid => {
        if (isTokenValid) {
          dataInterface.read('users', username, (err, userData) => {
            if (!err && userData) {
              getOrders(userData.orders, (ordersErr, orders) => {
                if (!ordersErr) {
                  callback(200, orders);
                } else {
                  callback(500, { error: 'Error getting orders.' });
                }
              });
            } else {
              callback(500, { error: 'Error reading user orders.' });
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
  post: (data: ParsedRequest, callback: HandlerCallback<undefined>) => {
    const id = validateTokenId(data.headers.token);
    const username = validateUsername(data.pathVariables && data.pathVariables.username);

    if (id && username) {
      verifyToken(id, username, isTokenValid => {
        if (isTokenValid) {
          dataInterface.read('users', username, (userErr, userData) => {
            if (!userErr && userData) {
              calculateCartPaymentAmount(userData.cart, (amount: number | false) => {
                if (amount) {
                  createOrder(username, userData.cart, amount, (err, newOrderId) => {
                    if (!err && newOrderId) {
                      makePayment(amount * 100, 'usd', (paymentErr: CallbackError | false) => {
                        if (!paymentErr) {
                          updateOrder(newOrderId, { paid: true }, (updateErr, updatedOrder) => {
                            if (!err) {
                            } else {
                              // issue updating db
                            }
                          });
                          resetUserCart(username, resetErr => {
                            if (!resetErr) {
                            } else {
                              // issue resetting cart
                            }
                          });
                          sendSuccessfulOrderEmail(userData.email, sendEmailErr => {
                            if (!sendEmailErr) {
                            } else {
                              // issue sending confirmation email
                            }
                          });
                          callback(200);
                        } else {
                          callback(500, { error: `Error making payment ${paymentErr.error}` });
                        }
                      });
                    } else {
                      callback(500, { error: `Error processing payment: create order: ${err && err.error}` });
                    }
                  });
                } else {
                  callback(500, { error: 'Error processing payment amount' });
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

const createOrder = (
  username: string,
  cart: Cart,
  price: number,
  callback: (err: CallbackError | false, id?: string) => void
) => {
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
        addUserOrder(username, id, updateUserErr => {
          if (!updateUserErr) {
            callback(false, id);
          } else {
            callback({ error: 'Error updating user orders' });
          }
        });
      } else {
        callback(err);
      }
    });
  } else {
    callback({ error: 'Error creating id' });
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

export const getOrders = async (
  orderIds: string[],
  callback: (err: CallbackError | false, orders?: Order[]) => void
) => {
  const orderPromises: Array<Promise<Order>> = [];
  orderIds.forEach(id => {
    orderPromises.push(
      new Promise((resolve, reject) => {
        dataInterface.read('orders', id, (err, order) => {
          if (!err && order) {
            resolve(order);
          } else {
            reject({ error: `Could not get order ${id}` });
          }
        });
      })
    );
  });

  try {
    const orders = await Promise.all(orderPromises);
    callback(false, orders);
  } catch (e) {
    callback({ error: e.error });
  }
};
