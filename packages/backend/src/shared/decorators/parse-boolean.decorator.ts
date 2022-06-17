import { Transform } from 'class-transformer';

const optionalBooleanMapper = new Map([
  ['undefined', undefined],
  ['true', true],
  ['false', false],
]);
/**
 * a workaround for boolean parameters in url or body
 * @link https://github.com/typestack/class-transformer/issues/676#issuecomment-822699830
 * @returns
 */
export const ParseOptionalBoolean = () =>
  Transform(({ value }) => optionalBooleanMapper.get(value));
