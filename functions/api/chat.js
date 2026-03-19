const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store"
};

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json; charset=UTF-8",
      ...extraHeaders
    }
  });
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

export async function onRequestPost(context) {
  let payload;
  try {
    payload = await context.request.json();
  } catch (_err) {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const safeBase = String(payload?.baseUrl || "").trim().replace(/\/+$/, "");
  const apiKey = String(payload?.apiKey || "").trim();
  const model = String(payload?.model || "deepseek-chat").trim();
  const messages = Array.isArray(payload?.messages) ? payload.messages : [];
  const maxTokens = Number(payload?.maxTokens) || 256;

  if (!safeBase) {
    return jsonResponse({ error: "Base URL missing" }, 400);
  }
  if (!apiKey) {
    return jsonResponse({ error: "API key missing" }, 400);
  }
  if (!messages.length) {
    return jsonResponse({ error: "Messages missing" }, 400);
  }

  try {
    const upstream = await fetch(`${safeBase}/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.1,
        max_tokens: maxTokens
      })
    });

    const contentType = upstream.headers.get("content-type") || "application/json; charset=UTF-8";
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": contentType
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upstream request failed";
    return jsonResponse({ error: message }, 502);
  }
}
