export interface UserContext {
  current_zone: string;
}

export interface AskRequest {
  question: string;
  user_context: UserContext;
}

export interface AskResponse {
  recommendation: string;
  reason: string;
  alternative?: string | null;
}

export async function submitQuestion(request: AskRequest): Promise<AskResponse> {
  const res = await fetch("http://127.0.0.1:8000/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error("Failed to analyze stadium conditions");
  }

  return res.json();
}
