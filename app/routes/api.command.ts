import { parseCommand } from "~/features/command-bar/services/llm.service";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const input = String(formData.get("input") || "").trim();

  if (!input) {
    return Response.json({ error: "Input is required" }, { status: 400 });
  }

  const command = await parseCommand(input);
  return Response.json({ command });
}
