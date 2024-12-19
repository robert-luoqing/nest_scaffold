import { syncUtil } from './sync.util';

export type HeaderModel = {
  [key: string]: string;
};

export type TokenExpiredHandle = (
  headers?: HeaderModel,
) => Promise<HeaderModel>;

class FetchError extends Error {
  response: Response | { status: number };
  constructor(message: string, response: Response | { status: number }) {
    super(message);
    this.response = response;
  }
}

class HttpUtil {
  async get(
    url: string,
    headers?: HeaderModel,
    tokenExpiredHandle?: TokenExpiredHandle,
  ): Promise<string> {
    return await this.fetchWithTry(
      url,
      0,
      {
        method: 'GET',
        headers,
      },
      tokenExpiredHandle,
    );
  }
  async getWithTry(
    url: string,
    tryTimes: number,
    headers: HeaderModel,
    tokenExpiredHandle?: TokenExpiredHandle,
  ): Promise<string> {
    return await this.fetchWithTry(
      url,
      tryTimes,
      {
        method: 'GET',
        headers,
      },
      tokenExpiredHandle,
    );
  }

  async post(
    url: string,
    body: string,
    headers?: HeaderModel,
    tokenExpiredHandle?: TokenExpiredHandle,
  ): Promise<string> {
    return await this.fetchWithTry(
      url,
      0,
      {
        method: 'POST',
        headers,
        body,
      },
      tokenExpiredHandle,
    );
  }
  async postWithTry(
    url: string,
    body: string,
    tryTimes: number,
    headers: HeaderModel,
    tokenExpiredHandle?: TokenExpiredHandle,
  ): Promise<string> {
    return await this.fetchWithTry(
      url,
      tryTimes,
      {
        method: 'POST',
        headers,
        body,
      },
      tokenExpiredHandle,
    );
  }

  async deleteWithTry(
    url: string,
    body: string,
    tryTimes: number,
    headers: HeaderModel,
    tokenExpiredHandle?: TokenExpiredHandle,
  ): Promise<string> {
    return await this.fetchWithTry(
      url,
      tryTimes,
      {
        method: 'DELETE',
        headers,
        body,
      },
      tokenExpiredHandle,
    );
  }

  async fetchWithTry(
    url: string,
    tryTimes: number,
    options: {
      body?: string;
      method?: 'GET' | 'POST' | 'DELETE';
      headers?: HeaderModel;
    },
    tokenExpiredHandle?: TokenExpiredHandle,
  ): Promise<string> {
    // timeout: 5 min
    let times = 0;
    const newOptions = { ...(options || {}) };
    while (true) {
      try {
        return await this.fetchDataWithTimeout(url, 1000 * 60 * 5, newOptions);
      } catch (ex: any) {
        // If it is page is not exist, we will throw error directly.
        if (ex?.status == 404 || ex?.response?.status == 404) {
          throw ex;
        }
        if (ex?.status == 403 || ex?.response?.status == 403) {
          if (tokenExpiredHandle) {
            newOptions.headers = await tokenExpiredHandle(newOptions.headers);
          } else {
            throw ex;
          }
        }
        times++;
        if (times > tryTimes) {
          throw ex;
        }
        // The first is wait 0.5 seconds, the second is wait for 2 seconds.....
        await syncUtil.wait(500 * times * times);
      }
    }
  }

  private fetchDataWithTimeout = async (
    url: string,
    timeout: number,
    options?: {
      body?: string;
      method?: 'GET' | 'POST' | 'DELETE';
      headers?: HeaderModel;
    },
  ): Promise<string> => {
    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => {
        controller.abort();
        reject(new FetchError('Timeout', { status: 1000 }));
      }, timeout),
    );

    const fetchPromise = fetch(url, {
      method: options?.method || 'GET',
      headers: options?.headers,
      signal,
      body: options?.body,
    });

    try {
      const response: any = await Promise.race([fetchPromise, timeoutPromise]);

      if (!response.ok) {
        throw new FetchError(
          `HTTP error! status: ${response.status}`,
          response,
        );
      }

      return await response.text();
    } catch (error) {
      throw error;
    }
  };
}

export const httpUtil = new HttpUtil();
