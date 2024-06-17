type LengthFill<T extends unknown[], U, R extends unknown[] = []> =
  R['length'] extends T['length'] ? R : LengthFill<T, U, [U, ...R]>;

export class CSV<
  H extends [string, ...string[]],
  R extends Array<string> = LengthFill<H, string>
> {
  headers: H;
  rows: R[];
  isTSV: boolean;

  constructor(headers: H, isTSV: boolean) {
    this.headers = headers;
    this.rows = [];
    this.isTSV = isTSV;
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
    const sep = this.isTSV ? "\t" : ",";
    return [
      this.headers.join(sep),
      ...this.rows.map(row => row.join(sep))
    ].join("\n");
  }
}

export type CSVHeader<C> = C extends CSV<infer H> ? H : never;
export type CSVRow<C> = C extends CSV<[string, ...string[]], infer R> ? R : never;
