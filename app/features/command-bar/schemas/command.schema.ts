import { z } from "zod";

export const commandSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("search"),
    query: z.string().describe("Search query text"),
  }),
  z.object({
    type: z.literal("sort"),
    field: z
      .enum(["title", "price", "brand", "rating"])
      .describe("Column to sort by"),
    direction: z.enum(["asc", "desc"]).describe("Sort direction"),
  }),
  z.object({
    type: z.literal("navigate"),
    route: z.literal("add").describe("Target route"),
    title: z.string().optional().describe("Product name to prefill"),
    price: z.number().optional().describe("Product price to prefill"),
    brand: z.string().optional().describe("Product brand to prefill"),
  }),
  z.object({
    type: z.literal("refresh"),
  }),
  z.object({
    type: z.literal("goto_page"),
    page: z.number().int().positive().describe("Target page number"),
  }),
]);

export type Command = z.infer<typeof commandSchema>;
