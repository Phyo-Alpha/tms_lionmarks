import { api } from "@/server/api";
import { elysiaDb } from "@/server/db";
import { auth } from "@/server/lib/auth";
import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { logger } from "@rasla/logify";
import type { OpenAPIV3 } from "openapi-types";
import z from "zod";
import serverTiming from "@elysiajs/server-timing";

// This is copy pasta from ElysiaJS: https://elysiajs.com/integrations/better-auth
let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
  getPaths: (prefix = "/api/auth") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        reference[key] = paths[path];

        for (const method of Object.keys(paths[path])) {
          const operation = (reference[key] as any)[method];

          operation.tags = ["Better Auth"];
        }
      }

      return reference;
    }) as Promise<OpenAPIV3.PathsObject>,
  components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;

const app = new Elysia({ prefix: "/api" })
  .use(elysiaDb)
  .use(serverTiming())
  .use(
    logger({
      console: true,
      format:
        "🚀 {timestamp} | {level} | {method} {path} | Status: {statusCode} | Time: {duration}ms{ip}",
      level: "debug",
      includeIp: true,
    }),
  )
  .use(api)
  .use(
    openapi({
      path: "/docs",
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
      documentation: {
        info: {
          title: "FRI Portal API Documentation",
          version: "1.0.0",
          description: `API documentation for the Future Readiness Index Portal
### 🧠 Developer Notes

- Some endpoints only support the **PATCH** method.
  ➤ When adding a new item to an existing object, include the existing object's data, or it will be overwritten.
- When accessing organization related endpoint, set the organization by calling the \`/api/auth/organization/set-active\` endpoint.
`,
        },
        components: {
          ...(await OpenAPI.components),
          // securitySchemes: {
          //   BearerAuth: {
          //     type: "http",
          //     scheme: "bearer",
          //     bearerFormat: "JWT",
          //     description: "Enter your session token from Better Auth",
          //   },
          // },
        },
        paths: await OpenAPI.getPaths(),
        tags: [
          { name: "Survey", description: "Survey management endpoints" },
          { name: "Learners", description: "Learner management endpoints" },
          { name: "Courses", description: "Course catalog management endpoints" },
          {
            name: "Course Registrations",
            description: "Course registration management endpoints",
          },
          { name: "Better Auth", description: "Authentication endpoints" },
        ],
        security: [
          {
            BearerAuth: [],
          },
        ],
      },
    }),
  )
  .mount(auth.handler);

export default app;
