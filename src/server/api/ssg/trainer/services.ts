import { status } from "@/server/helpers/responseWrapper";
import { TrainerSSGModels } from "./models";
import { callSSGAPIWithTLS } from "../lib/ssg-tls-client";
import { handleSkillFutureError } from "../helper/errors";
import { encryptSSGPayload, decryptSSGPayload } from "../lib/ssg-encryption";

export abstract class TrainerSSGService {
  static async create(
    uen: string,
    dto: TrainerSSGModels.CreateTrainerRequestDto,
    apiVersion?: string,
  ) {
    try {
      const encryptedBody = encryptSSGPayload(dto);

      const headers: Record<string, string> = {
        "Content-Type": "text/plain",
      };

      if (apiVersion) {
        headers["x-api-version"] = apiVersion;
      }

      const response = await callSSGAPIWithTLS(`/trainers/${uen}`, {
        method: "POST",
        body: encryptedBody,
        headers,
      });

      const parsed = TrainerSSGModels.createTrainerResponse.parse(response);
      handleSkillFutureError(parsed);

      return parsed;
    } catch (err) {
      if (err && typeof err === "object" && "status" in err) {
        throw err;
      }
      console.log(err);
      throw status(500, "Server error while creating trainer");
    }
  }

  static async list(
    uen: string,
    query: TrainerSSGModels.ListTrainersRequestDto,
    apiVersion?: string,
  ) {
    try {
      const queryParams: Record<string, string> = {
        ...Object.fromEntries(
          Object.entries(query).map(([key, value]) => [
            key,
            typeof value === "number" ? String(value) : value || "",
          ]),
        ),
      };

      const headers: Record<string, string> = {};
      if (apiVersion) {
        headers["x-api-version"] = apiVersion;
      }

      const response = await callSSGAPIWithTLS<string>(`/trainingProviders/${uen}/trainers`, {
        method: "GET",
        queryParams,
        headers,
        returnRawResponse: true,
      });

      const decryptedResponse = decryptSSGPayload(response);
      const jsonResponse = JSON.parse(decryptedResponse);

      const parsed = TrainerSSGModels.listTrainersResponse.parse(jsonResponse);
      handleSkillFutureError(parsed);

      return parsed;
    } catch (err) {
      if (err && typeof err === "object" && "status" in err) {
        throw err;
      }
      console.log(err);
      throw status(500, "Server error while fetching trainers");
    }
  }

  static async update(
    uen: string,
    trainerId: string,
    dto: TrainerSSGModels.UpdateTrainerRequestDto,
    apiVersion?: string,
  ) {
    try {
      const encryptedBody = encryptSSGPayload(dto);

      const headers: Record<string, string> = {
        "Content-Type": "text/plain",
      };

      if (apiVersion) {
        headers["x-api-version"] = apiVersion;
      }

      const response = await callSSGAPIWithTLS(`/trainingProviders/${uen}/trainers/${trainerId}`, {
        method: "PUT",
        body: encryptedBody,
        headers,
      });

      const parsed = TrainerSSGModels.updateTrainerResponse.parse(response);
      handleSkillFutureError(parsed);

      return parsed;
    } catch (err) {
      if (err && typeof err === "object" && "status" in err) {
        throw err;
      }
      console.log(err);
      throw status(500, "Server error while updating trainer");
    }
  }

  static async delete(
    uen: string,
    trainerId: string,
    dto: TrainerSSGModels.DeleteTrainerRequestDto,
    apiVersion?: string,
  ) {
    try {
      const encryptedBody = encryptSSGPayload(dto);

      const headers: Record<string, string> = {
        "Content-Type": "text/plain",
      };

      if (apiVersion) {
        headers["x-api-version"] = apiVersion;
      }

      const response = await callSSGAPIWithTLS(`/trainingProviders/${uen}/trainers/${trainerId}`, {
        method: "PUT",
        body: encryptedBody,
        headers,
      });

      const parsed = TrainerSSGModels.deleteTrainerResponse.parse(response);
      handleSkillFutureError(parsed);

      return parsed;
    } catch (err) {
      if (err && typeof err === "object" && "status" in err) {
        throw err;
      }
      console.log(err);
      throw status(500, "Server error while deleting trainer");
    }
  }
}
