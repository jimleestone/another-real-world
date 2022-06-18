import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import path from 'path';
import slug from 'slug';
import { PRIVATE_KEY_FILE, PUBLIC_KEY_FILE } from './constants';

export default class Utility {
  /**
   *  slugify an article's title using slug and a random suffix
   * @param title
   * @returns
   */
  static slugify = (title: string): string => {
    return `${slug(title, { lower: true })}-${(
      (Math.random() * Math.pow(36, 6)) |
      0
    ).toString(36)}`;
  };

  static encodePassword = (password: string): string => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  };

  static checkPassword = (password: string, hash: string): boolean => {
    return bcrypt.compareSync(password, hash);
  };

  static isObject = (obj: any): boolean => {
    return (
      obj === Object(obj) && !Array.isArray(obj) && typeof obj !== 'function'
    );
  };

  /**
   * replace object keys using a callback function
   * @param fn callback to convert object key
   * @returns
   * @link https://stackoverflow.com/a/59773274/10583242
   */
  static fixKeys = (fn: any) => (obj: any) =>
    this.isObject(obj)
      ? Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [
            fn(k),
            Array.isArray(v)
              ? v.map(this.fixKeys(fn))
              : typeof v == 'object'
              ? this.fixKeys(fn)(v)
              : v,
          ]),
        )
      : obj;

  static fixValues = (fn: any) => (obj: any) =>
    this.isObject(obj)
      ? Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [
            k,
            Array.isArray(v)
              ? v.map(this.fixValues(fn))
              : typeof v == 'object'
              ? this.fixValues(fn)(v)
              : fn(v),
          ]),
        )
      : obj;

  static fixKeyValues = (fnKey: any, fnValue: any) => (obj: any) =>
    this.isObject(obj)
      ? Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [
            fnKey(k),
            Array.isArray(v)
              ? v.map(this.fixKeyValues(fnKey, fnValue))
              : typeof v == 'object'
              ? this.fixKeyValues(fnKey, fnValue)(v)
              : fnValue(v),
          ]),
        )
      : obj;

  static camelCase = (s: string) =>
    s.replace(/([-_][a-z])/gi, ($1) => {
      return $1.toUpperCase().replace('-', '').replace('_', '');
    });

  static camelCaseKeys = this.fixKeys(this.camelCase);

  static envArea = (s: any) =>
    typeof s === 'string'
      ? s.replace(/\$\{(.*?)}/, (s, c: string) => {
          return process.env[c];
        })
      : s;

  static extractEnv = this.fixValues(this.envArea);

  static camelCaseKeysAndExtractEnv = this.fixKeyValues(
    this.camelCase,
    this.envArea,
  );

  static loadPublicKey() {
    return fs.readFileSync(path.join(__dirname, '..', PUBLIC_KEY_FILE), 'utf8');
  }

  static loadPrivateKey() {
    return fs.readFileSync(
      path.join(__dirname, '..', PRIVATE_KEY_FILE),
      'utf8',
    );
  }
}
