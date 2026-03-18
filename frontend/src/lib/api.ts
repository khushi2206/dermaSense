const BASE_URL = "/api";

async function parseJsonSafe(response: Response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, init);

  if (!response.ok) {
    const details = await parseJsonSafe(response);
    throw new Error(`API Error ${response.status}${details ? `: ${JSON.stringify(details)}` : ""}`);
  }

  return (await parseJsonSafe(response)) as T;
}

export const api = {
  get: async <T>(path: string): Promise<T> => request<T>(path),
  post: async <TResponse, TBody = unknown>(path: string, body: TBody): Promise<TResponse> =>
    request<TResponse>(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
};
