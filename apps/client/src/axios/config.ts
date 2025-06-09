import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { IncomingHttpHeaders } from 'http';
import cookies from 'js-cookie';
import { isEmpty } from 'lodash';
import format from 'string-format';
import { SESSION_COOKIE } from '../providers/user-session.provider';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface AxiosRequestParams {
  url: string;
  method: Method;
  data?: any;
  params?: Record<string, any>;
  query?: Record<string, any>;
  headers?: IncomingHttpHeaders;
}

export const axiosHeaders = (
  headers?: IncomingHttpHeaders
): AxiosRequestHeaders => {
  const { contentType } = headers || {};

  const requestHeaders = {
    'Content-Type': contentType ?? 'application/json',
  } as AxiosRequestHeaders;

  const token = cookies.get(SESSION_COOKIE);
  if (token)
    requestHeaders.Authorization =
      buildAuthorizationHeader(token).Authorization;
  if (headers?.Authorization)
    requestHeaders.Authorization = headers.Authorization;

  return requestHeaders;
};

const parseUrlParams = (
  url: string,
  pathParams?: Record<string, any>,
  queryParams?: Record<string, any>
): string => {
  if (!isEmpty(pathParams)) {
    url = format(url, pathParams);
  }

  if (!isEmpty(queryParams)) {
    const params = new URLSearchParams(queryParams);

    url = `${url}?${params.toString()}`;
  }

  return url;
};

export function axiosRequestConfig({
  url,
  method,
  data,
  params,
  query,
  headers,
}: AxiosRequestParams): AxiosRequestConfig {
  const parsedUrl = parseUrlParams(url, params, query);

  const config = {
    baseURL: baseUrl,
    url: parsedUrl,
    method,
    ...(data ? { data } : {}),
    headers: axiosHeaders(headers),
  };

  return config;
}

export const buildAuthorizationHeader = (token?: string) => ({
  Authorization: `Bearer ${token}`,
});
