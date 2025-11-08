import type { App } from "@/app/api/[[...slugs]]/route";
import { treaty as elysiaTreaty, type Treaty } from "@elysiajs/eden";

type EdenResponse<T> = Promise<
  { data: T; error?: never } | { data?: never; error: { value: { message?: string } } }
>;

export function unwrapEdenResponse<TResponse, TParams extends any[]>(
  queryFn: (...params: TParams) => EdenResponse<TResponse>,
): (...params: TParams) => Promise<TResponse> {
  return async (...params: TParams) => {
    const response = await queryFn(...params);
    if (response.error) {
      throw new Error(response.error.value.message || "Request failed");
    }
    return response.data;
  };
}

declare global {
  interface ProxyConstructor {
    new <T extends object>(target: T, handler: ProxyHandler<T>): ProxyResponse<T>;
  }
}

function createFunctionProxy<T extends (...args: any[]) => any>(
  fn: T,
): T & ProxyResponse<Record<string, any>> {
  return new Proxy(fn, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      const propStr = prop.toString();
      const isHttpMethod = ["get", "post", "put", "delete", "patch"].includes(propStr);

      if (isHttpMethod) {
        return unwrapEdenResponse(value as any);
      }

      if (typeof value === "function") {
        return createFunctionProxy(value as any);
      }

      if (value && typeof value === "object") {
        return rpcProxy(value as object);
      }

      return value;
    },
    apply(target, thisArg, args) {
      const result = Reflect.apply(target, thisArg, args);
      if (typeof result === "function") {
        return createFunctionProxy(result);
      }
      if (result && typeof result === "object") {
        return rpcProxy(result);
      }
      return result;
    },
  }) as T & ProxyResponse<Record<string, any>>;
}

function rpcProxy<T extends object>(obj: T): ProxyResponse<T> {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      const propStr = prop.toString();
      const isHttpMethod = ["get", "post", "put", "delete", "patch"].includes(propStr);

      if (isHttpMethod) {
        return unwrapEdenResponse(value as any);
      }

      if (typeof value === "function") {
        return createFunctionProxy(value as any);
      }

      if (value && typeof value === "object") {
        return rpcProxy(value as object);
      }

      return value;
    },
  }) as ProxyResponse<T>;
}

const rawEden = elysiaTreaty<App>(process.env.NEXT_PUBLIC_SERVER_URL, {
  fetch: {
    credentials: "include",
  },
}).api;
export const eden = rpcProxy(rawEden);

type ExtractFromEdenResponse<T> = T extends (
  ...args: infer A
) => Promise<Treaty.TreatyResponse<infer Res>>
  ? (...args: A) => Promise<Treaty.Data<Promise<Treaty.TreatyResponse<Res>>>>
  : T;

type ProxyResponse<T> = {
  [K in keyof T]: T[K] extends (...args: any) => Promise<{ data: any }>
    ? ExtractFromEdenResponse<T[K]>
    : T[K] extends (...args: infer A) => infer R
      ? ProxyResponse<T[K]> & ((...args: A) => ProxyResponse<R>)
      : ProxyResponse<T[K]>;
};
