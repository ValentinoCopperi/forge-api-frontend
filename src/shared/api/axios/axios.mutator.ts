import type { AxiosError, AxiosRequestConfig } from 'axios'
import { axiosInstance } from './axios.instance'

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return axiosInstance({ ...config, ...options }).then(({ data }) => data)
}

export type ErrorType<Error> = AxiosError<Error>