const BASE_URL = "http://localhost:8080";
const REQUEST_TIMEOUT_MS = 15_000;

type ApiResponse<T> = { data: T };
type RequestConfig = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

async function request<T>(
  path: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const headers = new Headers();

  if (config.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: config.method ?? "GET",
      headers,
      body: config.body === undefined ? undefined : JSON.stringify(config.body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(errorBody || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
      return { data: undefined as T };
    }

    const data = (await response.json()) as T;
    return { data };
  } finally {
    clearTimeout(timeoutId);
  }
}

const http = {
  get<T>(path: string) { return request<T>(path); },
  post<T>(path: string, body?: unknown) { return request<T>(path, { method: "POST", body }); },
  put<T>(path: string, body?: unknown) { return request<T>(path, { method: "PUT", body }); },
  patch<T>(path: string, body?: unknown) { return request<T>(path, { method: "PATCH", body }); },
  delete(path: string) { return request<void>(path, { method: "DELETE" }); },
};

export default http;