import https from 'https';
import querystring from 'querystring';
import { CallbackError } from '../../types/errors';
import { validateEmail } from '../../utils/requestValidation';

export const sendSuccessfulOrderEmail = (email: string, callback: (error: CallbackError | false) => void) => {
  sendEmail(email, 'Order confirmation', 'Congratulations, your payment was successful!', callback);
};

export const sendEmail = (
  email: string,
  subject: string,
  text: string,
  callback: (error: CallbackError | false) => void
) => {
  const isEmailValid = validateEmail(email);

  if (isEmailValid) {
    const stringPayload = querystring.stringify({
      from: 'pizzeria@pizzeria.com',
      to: email,
      subject,
      text,
    });

    const requestDetails = {
      protocol: 'https:',
      hostname: 'api.mailgun.net',
      method: 'POST',
      path: `/v3/${ENV_MAILGUN}/messages`,
      auth: ENV_MAILGUN_WEBHOOK_SIGNING_KEY,
      headers: {
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
  }
};
