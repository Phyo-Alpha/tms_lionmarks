import { status } from "@/server/helpers/responseWrapper";
import type { SkillFutureResponse } from "../common/response";

/**
 * Handles SkillFuture API error responses
 * Checks if the response status indicates an error and extracts the error message
 * @param parsedResponse - The parsed SkillFuture response
 * @throws Status error with appropriate status code and message
 */
export function handleSkillFutureError<TData>(parsedResponse: SkillFutureResponse<TData>): void {
  const responseStatus = parsedResponse.status;
  const isSuccess = responseStatus === 200;

  if (!isSuccess) {
    const errorMessage =
      parsedResponse.error &&
      typeof parsedResponse.error === "object" &&
      "message" in parsedResponse.error &&
      Object.keys(parsedResponse.error).length > 0
        ? (parsedResponse.error as { message: string }).message
        : parsedResponse.errors?.[0]?.message || "Unknown error from SkillFuture API";

    const statusCode = responseStatus || 500;

    throw status(statusCode, errorMessage);
  }
}
