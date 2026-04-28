import os

import httpx
from fastapi import HTTPException
from fastapi.responses import JSONResponse

OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
REQUEST_TIMEOUT_SECONDS = float(os.getenv("AI_REQUEST_TIMEOUT_SECONDS", "60"))
OPENAI_TEMPERATURE = float(os.getenv("OPENAI_TEMPERATURE", "0"))  # AI 답변의 랜덤성/창의성 조절값 (낮으면 최대한 일관되게 답변함)


# 헤더 만드는 함수
def _openai_headers() -> dict[str, str]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not configured.")

    return {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

# HTTP 요청을 그대로 전달하는 함수
async def forward_to_openai(path: str, payload: dict) -> JSONResponse:
    try:
        # httpx.AsyncClient: 파이썬에서 HTTP 요청을 보내는 클라이언트 객체
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT_SECONDS) as client:
            response = await client.post(
                f"{OPENAI_BASE_URL}{path}",
                headers=_openai_headers(),
                json=payload,
            )
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"OpenAI request failed: {exc}") from exc

    try:
        body = response.json()
    except ValueError:
        body = {"detail": response.text}

    return JSONResponse(status_code=response.status_code, content=body)

# 응답에서 content만 추출하는 함수
async def chat_completion_content(
    prompt: str,
    model: str | None = None,
    system_prompt: str | None = None,
) -> str:
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": model or OPENAI_MODEL,
        "messages": messages,
        "temperature": OPENAI_TEMPERATURE,
        "top_p": 1,
        "response_format": {"type": "json_object"},
    }

    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT_SECONDS) as client:
            response = await client.post(
                f"{OPENAI_BASE_URL}/chat/completions",
                headers=_openai_headers(),
                json=payload,
            )
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"OpenAI request failed: {exc}") from exc

    try:
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        try:
            detail = exc.response.json()
        except ValueError:
            detail = exc.response.text
        raise HTTPException(status_code=exc.response.status_code, detail=detail) from exc

    body = response.json()
    choices = body.get("choices", [])
    if not choices:
        raise HTTPException(status_code=502, detail="AI service returned an empty chat response.")

    message = choices[0].get("message", {})
    content = message.get("content", "")
    if not content:
        raise HTTPException(status_code=502, detail="AI service returned an empty message content.")

    return content
