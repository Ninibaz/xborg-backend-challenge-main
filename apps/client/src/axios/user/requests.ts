import axios, { AxiosResponse } from 'axios';
import { IncomingHttpHeaders } from 'http';
import { axiosRequestConfig, Method } from '../config';
import { Urls } from './constants';
import { AuthTokenRes, LoginReq, SignupReq, User } from './types';

export const getUser = async (
  headers?: IncomingHttpHeaders
): Promise<AxiosResponse<User, any>> =>
  axios(
    axiosRequestConfig({
      url: Urls.GET_USER,
      method: Method.GET,
      headers,
    })
  );

export const signup = async (
  signup: SignupReq
): Promise<AxiosResponse<AuthTokenRes, any>> =>
  axios(
    axiosRequestConfig({ url: Urls.SIGNUP, method: Method.POST, data: signup })
  );

export const login = async (
  login: LoginReq
): Promise<AxiosResponse<AuthTokenRes, any>> =>
  axios(
    axiosRequestConfig({ url: Urls.LOGIN, method: Method.POST, data: login })
  );
