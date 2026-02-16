import { ChatOllama } from "@langchain/ollama";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { commandSchema, type Command } from "../schemas/command.schema";

const SYSTEM_PROMPT = `You are a command parser for a product management admin panel.
Parse the user's natural language input into exactly one structured command.

Available commands:
- search: Find products by text query. Use for any product search request.
- sort: Sort the product table. Fields: "title", "price", "brand", "rating". Directions: "asc", "desc".
- navigate: Go to a page. Currently only "add" route is supported (to add a new product).
- refresh: Reload the product data.
- goto_page: Navigate to a specific page number in the product list.

Rules:
- If the input looks like a search query (product name, brand, category), use "search".
- If the user asks to sort/order by something, use "sort".
- "add product", "create product", "new product" → navigate to "add". Extract product details if provided: title, price, brand. Example: "add iPhone 15 Pro by Apple for 999" → navigate with title="iPhone 15 Pro", brand="Apple", price=999.
- "refresh", "reload", "update" → refresh.
- "page 3", "go to page 5", "страница 2" → goto_page.
- Support both English and Russian inputs.
- When in doubt, default to "search" with the input as the query.`;

function createLLM(): BaseChatModel {
  const provider = process.env.LLM_PROVIDER || "openai";

  if (provider === "groq") {
    return new ChatGroq({
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
      maxRetries: 1,
      timeout: 10000,
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is required when LLM_PROVIDER=openai");
    }
    return new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL || "meta-llama/llama-3.1-8b-instruct",
      temperature: 0.1,
      maxRetries: 1,
      timeout: 10000,
      apiKey,
      configuration: {
        baseURL: process.env.OPENAI_BASEURL,
      },
    });
  }

  return new ChatOllama({
    model: "llama3.1:8b",
    temperature: 0.1,
    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  });
}

export async function parseCommand(input: string): Promise<Command> {
  try {
    const llm = createLLM();
    const structured = llm.withStructuredOutput(commandSchema);

    const result = await structured.invoke([
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage(input),
    ]);

    return result as Command;
  } catch (error) {
    console.error("[CommandBar] LLM error:", error);
    return { type: "search", query: input };
  }
}
