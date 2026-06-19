import { z } from "zod";

/**
 * Describes the editable fields of a template. Stored as JSON in
 * Template.fieldsSchema and consumed by the schema-driven admin form renderer
 * (app/admin) so we never hardcode one form per template.
 */

export const FIELD_TYPES = [
  "text",
  "textarea",
  "date",
  "time",
  "number",
  "boolean",
  "image",
  "image[]",
  "audio",
  "iconKey",
  "object",
  "list",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export interface FieldDef {
  type: FieldType;
  label?: string;
  required?: boolean;
  /** When true, this field stores one value per locale (localizedGroup). */
  localized?: boolean;
  help?: string;
  /** For type "object": nested fields. */
  fields?: Record<string, FieldDef>;
  /** For type "list": shape of each item. */
  itemFields?: Record<string, FieldDef>;
}

export type FieldsSchema = Record<string, FieldDef>;

// Lazy recursive zod schema for validating a fieldsSchema blob.
export const fieldDefSchema: z.ZodType<FieldDef> = z.lazy(() =>
  z.object({
    type: z.enum(FIELD_TYPES),
    label: z.string().optional(),
    required: z.boolean().optional(),
    localized: z.boolean().optional(),
    help: z.string().optional(),
    fields: z.record(z.string(), fieldDefSchema).optional(),
    itemFields: z.record(z.string(), fieldDefSchema).optional(),
  }),
);

export const fieldsSchemaSchema = z.record(z.string(), fieldDefSchema);
