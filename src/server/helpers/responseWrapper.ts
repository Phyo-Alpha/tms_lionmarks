// eslint-disable-next-line no-restricted-imports
import { status as elysiaStatus, InvertedStatusMap } from "elysia";

export function status(
  statusCode: Parameters<typeof elysiaStatus>[0],
  response?:
    | {
        message?: string;
        details?: string | object;
      }
    | string,
) {
  const statusCodeName =
    typeof statusCode === "number"
      ? InvertedStatusMap[statusCode as keyof typeof InvertedStatusMap]
      : statusCode;

  const responseBody =
    typeof response === "string" || response === undefined
      ? { message: response ?? statusCodeName }
      : response;

  return elysiaStatus(statusCode, responseBody);
}
