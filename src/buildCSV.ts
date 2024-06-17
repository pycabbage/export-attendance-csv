type LengthFill<T extends unknown[], U, R extends unknown[] = []> =
  R['length'] extends T['length'] ? R : LengthFill<T, U, [U, ...R]>;

export class CSV<
  H extends [string, ...string[]],
  R extends Array<string> = LengthFill<H, string>
> {
  headers: H;
  rows: R[];

  constructor(headers: H) {
    this.headers = headers;
    this.rows = [];
  }

  add(row: R): this
  add(row: R[]): this
  add(...row: R[]): this
  add(row: R | R[]): this {
    if (Array.isArray(row) && row.every(r => Array.isArray(r))) {
      row.forEach(r => this.add(r))
    } else {
      if (row.length !== this.headers.length) {
        throw new Error(`Row length ${row.length} does not match header length ${this.headers.length} : ${row}`);
      }
      this.rows.push(row);
    }
    return this;
  }

  toString(): string {
    return [
      this.headers.join(","),
      ...this.rows.map(row => row.join(","))
    ].join("\n");
  }
}

export type CSVHeader<C> = C extends CSV<infer H> ? H : never;
export type CSVRow<C> = C extends CSV<[string, ...string[]], infer R> ? R : never;
