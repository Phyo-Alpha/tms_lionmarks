import z from "zod";

/**
 * Recursively makes all fields in a Zod schema nullable and optional
 */
function deepNullableOptional(schema: z.ZodTypeAny): z.ZodTypeAny {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const newShape: Record<string, z.ZodTypeAny> = {};

    for (const [key, value] of Object.entries(shape)) {
      const unwrapped =
        value instanceof z.ZodOptional || value instanceof z.ZodNullable
          ? (value as z.ZodOptional<z.ZodTypeAny> | z.ZodNullable<z.ZodTypeAny>).unwrap()
          : value;

      if (unwrapped instanceof z.ZodObject) {
        newShape[key] = deepNullableOptional(unwrapped).nullable().optional();
      } else if (unwrapped instanceof z.ZodArray) {
        const arraySchema = unwrapped as z.ZodArray<z.ZodTypeAny>;
        newShape[key] = z.array(deepNullableOptional(arraySchema.element)).nullable().optional();
      } else {
        newShape[key] = unwrapped.nullable().optional();
      }
    }

    return z.object(newShape);
  }

  if (schema instanceof z.ZodArray) {
    const arraySchema = schema as z.ZodArray<z.ZodTypeAny>;
    return z.array(deepNullableOptional(arraySchema.element)).nullable().optional();
  }

  const unwrapped =
    schema instanceof z.ZodOptional || schema instanceof z.ZodNullable
      ? (schema as z.ZodOptional<z.ZodTypeAny> | z.ZodNullable<z.ZodTypeAny>).unwrap()
      : schema;

  if (unwrapped instanceof z.ZodObject || unwrapped instanceof z.ZodArray) {
    return deepNullableOptional(unwrapped).nullable().optional();
  }

  return unwrapped.nullable().optional();
}

export { deepNullableOptional };
