// HTTP Client dengan interceptor dan error handling

import { retry, AppError, createErrorResponse } from '@/utils/errors';
import { logger } from '@/utils/logger';

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  params?: Record<string, any>;
}

export interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
  timestamp: string;
}

class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number = 30000;

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    let url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url += queryString ? `?${queryString}` : '';
    }

    return url;
  }

  private async executeRequest<T>(
    url: string,
    config: RequestConfig
  ): Promise<HttpResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.defaultTimeout,
      retries = 3,
    } = config;

    const mergedHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    const fetchFn = async (): Promise<HttpResponse<T>> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          method,
          headers: mergedHeaders,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const responseBody = await this.parseResponse<T>(response);

        if (!response.ok) {
          logger.error(`HTTP ${response.status}`, {
            url,
            method,
            status: response.status,
            body: responseBody,
          });

          throw new AppError(
            response.status,
            `HTTP_${response.status}`,
            this.getErrorMessage(response.status),
            responseBody
          );
        }

        logger.debug(`${method} ${url}`, { status: response.status });

        return {
          data: responseBody,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error && error.name === 'AbortError') {
          throw new AppError(408, 'REQUEST_TIMEOUT', 'Request timeout');
        }

        throw error;
      }
    };

    return retry(fetchFn, retries);
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (!contentType) {
      return {} as T;
    }

    if (contentType.includes('application/json')) {
      return response.json();
    }

    if (contentType.includes('text')) {
      return (await response.text()) as T;
    }

    return response.blob() as Promise<T>;
  }

  private getErrorMessage(status: number): string {
    const messages: Record<number, string> = {
      400: 'Request tidak valid',
      401: 'Autentikasi diperlukan',
      403: 'Akses ditolak',
      404: 'Resource tidak ditemukan',
      409: 'Konflik data',
      429: 'Terlalu banyak request',
      500: 'Kesalahan server',
      502: 'Bad Gateway',
      503: 'Service tidak tersedia',
    };

    return messages[status] || 'Terjadi kesalahan';
  }

  async get<T>(endpoint: string, config?: Partial<RequestConfig>): Promise<T> {
    const response = await this.executeRequest<T>(
      this.buildUrl(endpoint, config?.params),
      { ...config, method: 'GET' }
    );
    return response.data;
  }

  async post<T>(endpoint: string, body?: any, config?: Partial<RequestConfig>): Promise<T> {
    const response = await this.executeRequest<T>(this.buildUrl(endpoint), {
      ...config,
      method: 'POST',
      body,
    });
    return response.data;
  }

  async put<T>(endpoint: string, body?: any, config?: Partial<RequestConfig>): Promise<T> {
    const response = await this.executeRequest<T>(this.buildUrl(endpoint), {
      ...config,
      method: 'PUT',
      body,
    });
    return response.data;
  }

  async patch<T>(endpoint: string, body?: any, config?: Partial<RequestConfig>): Promise<T> {
    const response = await this.executeRequest<T>(this.buildUrl(endpoint), {
      ...config,
      method: 'PATCH',
      body,
    });
    return response.data;
  }

  async delete<T>(endpoint: string, config?: Partial<RequestConfig>): Promise<T> {
    const response = await this.executeRequest<T>(this.buildUrl(endpoint), {
      ...config,
      method: 'DELETE',
    });
    return response.data;
  }
}

// Singleton instance
export const httpClient = new HttpClient();

// Helper functions
export async function fetchData<T>(url: string, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, init);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    logger.error('Fetch error', { url }, error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}

export async function postData<T>(url: string, data?: any, init?: RequestInit): Promise<T> {
  return httpClient.post<T>(url, data, init);
}
