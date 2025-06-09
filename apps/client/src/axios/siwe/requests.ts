import axios, { AxiosResponse } from 'axios';
import { axiosRequestConfig, Method } from '../config';
import { Urls } from './constants';

export const getNonce = async (
  address: string
): Promise<AxiosResponse<string, any>> =>
  axios(
    axiosRequestConfig({
      url: Urls.GET_NONCE,
      method: Method.GET,
      params: { address },
    })
  );
