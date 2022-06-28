import { array, dict, either, string } from 'decoders';

export type GenericErrors = Record<string, string[]> | string[] | string;

export const genericErrorsDecoder = either(dict(array(string)), string, array(string));
