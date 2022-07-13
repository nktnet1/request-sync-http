export class SyncResponse {
  body: string;
  status: number;
  statusCode: number;

  constructor(body: string, code: number) {
    this.body = body;
    this.status = code;
    this.statusCode = code;
  }

  getBody(): string {
    return this.body;
  }

  getJSON() {
    try {
      return JSON.parse(this.body);
    } catch (e) {
      return {
        error: 'Failed to parse JSON',
        hint: 'This may be because your server crashed or returned invalid JSON responses',
        body: this.body
      };
    }
  }
}
