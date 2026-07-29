import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  isAxiosError,
} from "axios";

// We keep error details in a simple shape so the UI layer
// can decide how to display them without importing Axios types.
export interface ApiErrorPayload {
  message: string;
  status?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

// A thin wrapper around Error that carries HTTP context.
// This way catch blocks can check `error.status` or `error.isClientError`
// without digging into Axios internals.
export class ApiError extends Error {
  public readonly status?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly data?: any;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiError";
    this.status = payload.status;
    this.data = payload.data;
  }

  get isClientError(): boolean {
    return !!this.status && this.status >= 400 && this.status < 500;
  }

  get isServerError(): boolean {
    return !!this.status && this.status >= 500;
  }
}

export const apiClient: AxiosInstance = axios.create({
  timeout: 10_000,
  headers: { Accept: "application/json" },
});

// Request interceptor — a good place to attach auth headers later.
apiClient.interceptors.request.use(
  (config) => config,
  (error: unknown) => Promise.reject(normalizeError(error)),
);

// Response interceptor — turns any failure into our ApiError
// so the rest of the app never has to deal with raw Axios errors.
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeError(error)),
);

// Tries to pull a useful message out of whatever Axios gives us,
// then wraps it in ApiError. Handles network errors, server errors,
// and anything else that might slip through.
function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isAxiosError(error)) {
    const status = error.response?.status;
    const serverMessage =
      (error.response?.data as Record<string, string> | undefined)?.message ??
      (error.response?.data as Record<string, string> | undefined)?.error ??
      error.message;

    return new ApiError({
      message: serverMessage,
      status,
      data: error.response?.data,
    });
  }

  if (error instanceof Error) {
    return new ApiError({ message: error.message });
  }

  return new ApiError({ message: "An unexpected error occurred." });
}

// Generic request helper that unwraps `response.data` for you.
// Every convenience method below delegates to this.
async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.request<T>(config);
  return response.data;
}

// Shorthand methods — keeps service files clean and readable.

export const get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  request<T>({ ...config, method: "GET", url });

export const post = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => request<T>({ ...config, method: "POST", url, data });

export const put = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => request<T>({ ...config, method: "PUT", url, data });

export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  request<T>({ ...config, method: "DELETE", url });
