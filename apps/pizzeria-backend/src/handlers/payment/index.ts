import https from 'https';
import querystring from 'querystring';
import { User } from '../../data/types';
import { ParsedRequest } from '../../server/helpers';
import { StatusCode } from '../../server/types';
import { CallbackError } from '../../types/errors';

const debug = Debug('app:payment');

export const makePayment = (amount: number, currency: string, callback: (error: CallbackError | false) => void) => {
  const stringPayload = querystring.stringify({
    amount: Math.floor(amount),
    currency,
    source: 'tok_visa',
  });

  debug(amount, currency, ENV_STRIPE_SECRET);

  const requestDetails = {
    protocol: 'https:',
    hostname: 'api.stripe.com',
    method: 'POST',
    path: '/v1/charges',
    headers: {
      authorization: `Bearer ${ENV_STRIPE_SECRET}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(stringPayload),
    },
  };

  const req = https.request(requestDetails, res => {
    const statusCode = res.statusCode;

    if (statusCode === 200 || statusCode === 201) {
      callback(false);
    } else {
      callback({ error: `Status code was ${statusCode}` });
    }
  });

  // bind to error event so it doesn't get thrown
  req.on('error', e => {
    callback({ error: e.message });
  });

  // add the payload
  req.write(stringPayload);

  req.end();
};

export const paymentsHandler = {
  makePayment: (data: ParsedRequest, callback: (statusCode: StatusCode, payload?: CallbackError | User) => void) => {
    const amount = typeof data.payload.amount === 'number' && data.payload.amount > 0 ? data.payload.amount : false;
    const currency = typeof data.payload.currency === 'string' ? data.payload.currency : false;

    if (amount && currency) {
      makePayment(amount, currency, (error: CallbackError | false) => {
        if (!error) {
          callback(204);
        } else {
          callback(500, { error: 'Could not make payment.' + error.error });
        }
      });
    } else {
      callback(403, { error: 'Invalid parameters.' });
    }
  },
};
