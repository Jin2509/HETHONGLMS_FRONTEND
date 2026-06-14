export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface SpringPage<T> {
  content: T[];
  totalElements?: number;
}

export function hasData<T>(payload: unknown): payload is ApiResponse<T> {
  return typeof payload === "object" && payload !== null && "data" in payload;
}

export function unwrapData<T>(payload: unknown): T {
  if (hasData<T>(payload)) {
    return payload.data;
  }
  if (typeof payload === "object" && payload !== null && "result" in payload) {
    return (payload as { result: T }).result;
  }
  return payload as T;
}

export function unwrapArray<T>(payload: unknown): T[] {
  const data = unwrapData<unknown>(payload);

  if (Array.isArray(data)) {
    return data as T[];
  }

  if (typeof data === "object" && data !== null) {
    if ("content" in data && Array.isArray((data as { content?: unknown }).content)) {
      return (data as SpringPage<T>).content;
    }
    if ("items" in data && Array.isArray((data as { items?: unknown }).items)) {
      return (data as { items: T[] }).items;
    }
    if ("records" in data && Array.isArray((data as { records?: unknown }).records)) {
      return (data as { records: T[] }).records;
    }
  }

  return [];
}

export function unwrapTotal(payload: unknown, fallbackLength: number): number {
  const data = unwrapData<unknown>(payload);
  if (typeof data === "object" && data !== null) {
    const total = (data as { total?: unknown; totalElements?: unknown }).total ?? (data as { totalElements?: unknown }).totalElements;
    if (typeof total === "number") {
      return total;
    }
  }
  return fallbackLength;
}
