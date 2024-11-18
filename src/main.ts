interface Env {
  OPENAI_API_DEFAULT_URL: string;
  OPENAI_API_KEY: string;
  OPENAI_DEFAULT_MODEL: string;
  ALLOWED_ORIGINS: string;
}

interface RequestBody {
  text: string;
  prompt?: string;
  model?: string;
  apiUrl?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigins = env.ALLOWED_ORIGINS.split(",").map(o => o.trim());
    
    const corsHeaders = {
      "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { 
        status: 405,
        headers: corsHeaders 
      });
    }

    try {
      const { text, prompt, model, apiUrl } = (await request.json()) as RequestBody;

      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return new Response("Text content is required", { status: 400 });
      }

      const openAIResponse = await fetch(apiUrl || env.OPENAI_API_DEFAULT_URL, {
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
            ...corsHeaders
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
            ...corsHeaders
          },
        }
      );
    }
  },
};
