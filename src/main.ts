interface Env {
  OPENAI_API_URL: string;
  OPENAI_API_KEY: string;
  OPENAI_DEFAULT_MODEL: string;
  ALLOWED_ORIGINS: string;
}

interface RequestBody {
  text: string;
  prompt?: string;
  model?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const { text, prompt, model } = (await request.json()) as RequestBody;

      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return new Response("Text content is required", { status: 400 });
      }

      const openAIResponse = await fetch(env.OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: model || env.OPENAI_DEFAULT_MODEL,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt || "Please summarize this text:",
                },
                {
                  type: "text",
                  text: text,
                },
              ],
            },
          ],
          max_tokens: 1000,
        }),
      });

      const result = await openAIResponse.json();

      return new Response(
        JSON.stringify({
          result: result,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  },
};
