import { Err, Ok, Result } from '@hqoss/monads';
import axios from 'axios';
import { Decoder, object } from 'decoders';
import { formatShort } from 'decoders/format';
import settings from '../config/settings';
import { GenericErrors, genericErrorsDecoder } from '../types/error';

const instance = axios.create({
  baseURL: settings.baseApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function get<TResponse>(
  url: string,
  responseValidator?: Decoder<TResponse>
): Promise<Result<TResponse, GenericErrors>> {
  const token = localStorage.getItem('token');
  if (token) instance.defaults.headers.common['Authorization'] = `${settings.tokenPrefix} ${token}`;
  try {
    const res = await instance.get<TResponse>(url);
    if (responseValidator) {
      return Ok(responseValidator.verify(res.data, formatShort));
    }
    return Ok(res.data);
  } catch (err) {
    return handleErrors(err);
  }
}

export async function post<TResponse>(
  url: string,
  data?: Partial<Record<keyof unknown, unknown>>,
  responseValidator?: Decoder<TResponse>
): Promise<Result<TResponse, GenericErrors>> {
  const token = localStorage.getItem('token');
  if (token) instance.defaults.headers.common['Authorization'] = `${settings.tokenPrefix} ${token}`;
  try {
    const res = await instance.post<TResponse>(url, JSON.stringify(data));
    if (responseValidator) {
      return Ok(responseValidator.verify(res.data, formatShort));
    }
    return Ok(res.data);
  } catch (err) {
    return handleErrors(err);
  }
}

export async function put<TResponse>(
  url: string,
  data?: Partial<Record<keyof unknown, unknown>>,
  responseValidator?: Decoder<TResponse>
): Promise<Result<TResponse, GenericErrors>> {
  const token = localStorage.getItem('token');
  if (token) instance.defaults.headers.common['Authorization'] = `${settings.tokenPrefix} ${token}`;
  try {
    const res = await instance.put<TResponse>(url, JSON.stringify(data));
    if (responseValidator) {
      return Ok(responseValidator.verify(res.data, formatShort));
    }
    return Ok(res.data);
  } catch (err) {
    return handleErrors(err);
  }
}

export async function remove<TResponse>(
  url: string,
  responseValidator?: Decoder<TResponse>
): Promise<Result<TResponse, GenericErrors>> {
  const token = localStorage.getItem('token');
  if (token) instance.defaults.headers.common['Authorization'] = `${settings.tokenPrefix} ${token}`;
  try {
    const res = await instance.delete<TResponse>(url);
    if (responseValidator) {
      return Ok(responseValidator.verify(res.data, formatShort));
    }
    return Ok(res.data);
  } catch (err) {
    return handleErrors(err);
  }
}

function handleErrors(err: unknown) {
  let ret: Result<never, GenericErrors> = Err('unknown errors');
  if (axios.isAxiosError(err)) {
    if (err.response) {
      if (err.response.status === 401 && localStorage.getItem('token')) {
        localStorage.removeItem('token');
        location.href = '/';
        return ret;
      }
      const { data } = err.response;
      if (typeof data === 'object' && data !== null && 'errors' in data) {
        ret = Err((data as { errors: GenericErrors }).errors);
      } else if (typeof data === 'object' && data !== null && 'message' in data) {
        ret = Err(object({ message: genericErrorsDecoder }).verify(data).message);
      }
    }
  } else {
    ret = Err(object({ message: genericErrorsDecoder }).verify(err).message);
  }
  return ret;
}
