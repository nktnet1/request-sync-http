import { execSync } from 'child_process';
import { SyncResponse } from './response';
import { HttpVerb } from './types';

interface Payload {
  json?: object;
  qs?: object;
}

const wrapQuotes = (str: string) => "'" + str + "'";

function request(method: HttpVerb, url: string, payload?: Payload): SyncResponse {
  const command = [
    'curl',
    '--silent',
    '--request', wrapQuotes(method),
    '--write-out', '%{http_code}'
  ];

  if (payload) {
    if (payload.json) {
      command.push(
        '--header', '"Content-Type: application/json"',
        '--data', wrapQuotes(JSON.stringify(payload.json))
      );
    }

    if (payload.qs) {
      url += '?' + new URLSearchParams(payload.qs as URLSearchParams).toString();
    }
  }

  command.push(wrapQuotes(url));

  let jsonString;
  let statusCode;
  try {
    const result = execSync(command.join(' ')).toString();
    jsonString = result.slice(0, -3);
    statusCode = parseInt(result.slice(-3));
  } catch (e) {
    console.log(e);
    return new SyncResponse(
      JSON.stringify(
        {
          error: 'Failed to send request.',
          hint: 'Have you started your server (e.g. in a different terminal)? Also, ensure that you are returning a valid JSON object response.'
        }),
      500
    );
  }

  return new SyncResponse(jsonString, statusCode);
}

export default request;
