// import * as cryptojs from 'crypto-js';

// const salt = cryptojs.lib.WordArray.random(12); // Randomly generated for each request.
// const timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString(); // Current Unix time (seconds).

// export const getRequestHeaders = (
//   method: string,
//   url: string,
//   data: any,
//   secretKey: string,
//   accessKey: string
// ) => {
//   console.log(method, url, data, secretKey, accessKey);
//   const to_sign =
//     method +
//     url +
//     salt +
//     timestamp +
//     accessKey +
//     secretKey +
//     JSON.stringify(data);
//   let signature = cryptojs.enc.Hex.stringify(
//     cryptojs.HmacSHA256(to_sign, secretKey)
//   );

//   signature = cryptojs.enc.Base64.stringify(cryptojs.enc.Utf8.parse(signature));

//   return {
//     access_key: accessKey,
//     signature,
//     salt: salt.toString(),
//     timestamp,
//     'Content-Type': `application/json`,
//   };
// };

import * as crypto from 'crypto';
const secretKey =
  '4389a8d28c1c7b86f1e7e3ddfd84b3b71fb57240d8b3f2cfdd4be5ac0f22bed143d9b28739d89f6f';
const accessKey = '4C15ED203D6CA6141CF8';
const log = false;

async function makeRequest(method: string, urlPath: string, body: any = null) {
  try {
    const httpMethod = method;
    const httpBaseURL = 'sandboxapi.rapyd.net';
    const httpURLPath = urlPath;
    const salt = generateRandomString(8);
    const idempotency = new Date().getTime().toString();
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = sign(httpMethod, httpURLPath, salt, timestamp, body);

    const options = {
      hostname: httpBaseURL,
      port: 443,
      path: httpURLPath,
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json',
        salt: salt,
        timestamp: timestamp,
        signature: signature,
        access_key: accessKey,
        idempotency: idempotency,
      },
    };

    return await httpRequest(options, body, log);
  } catch (error) {
    console.error('Error generating request options');
    throw error;
  }
}

function sign(
  method: string,
  urlPath: string,
  salt: string,
  timestamp: string,
  body: any = null
) {
  try {
    let bodyString = '';
    if (body) {
      bodyString = JSON.stringify(body);
      bodyString = bodyString == '{}' ? '' : bodyString;
    }

    const toSign =
      method.toLowerCase() +
      urlPath +
      salt +
      timestamp +
      accessKey +
      secretKey +
      bodyString;
    log && console.log(`toSign: ${toSign}`);

    const hash = crypto.createHmac('sha256', secretKey);
    hash.update(toSign);
    const signature = Buffer.from(hash.digest('hex')).toString('base64');
    log && console.log(`signature: ${signature}`);

    return signature;
  } catch (error) {
    console.error('Error generating signature');
    throw error;
  }
}

function generateRandomString(size: number) {
  try {
    return crypto.randomBytes(size).toString('hex');
  } catch (error) {
    console.error('Error generating salt');
    throw error;
  }
}

async function httpRequest(options: any, body: any = null) {
  return new Promise((resolve, reject) => {
    try {
      let bodyString = '';
      if (body) {
        bodyString = JSON.stringify(body);
        bodyString = bodyString == '{}' ? '' : bodyString;
      }

      log && console.log(`httpRequest options: ${JSON.stringify(options)}`);
      const req = https.request(options, (res) => {
        let response = {
          statusCode: res.statusCode,
          headers: res.headers,
          body: '',
        };

        res.on('data', (data) => {
          response.body += data;
        });

        res.on('end', () => {
          response.body = response.body ? JSON.parse(response.body) : {};
          log &&
            console.log(`httpRequest response: ${JSON.stringify(response)}`);

          if (response.statusCode !== 200) {
            return reject(response);
          }

          return resolve(response);
        });
      });

      req.on('error', (error) => {
        return reject(error);
      });

      req.write(bodyString);
      req.end();
    } catch (err) {
      return reject(err);
    }
  });
}

exports.makeRequest = makeRequest;
