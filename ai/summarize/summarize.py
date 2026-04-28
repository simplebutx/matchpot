import json
import re

from fastapi import HTTPException

from openai_client import chat_completion_content

MAX_INPUT_CHARS = 6000

# 명령 프롬프트
def _summary_prompt() -> str:
    return (
        "너는 행사 리뷰를 요약하는 한국어 분석기다.\n"
        "입력된 리뷰 전체를 읽고 참가자 경험의 핵심만 간결하게 정리해라.\n"
        "반드시 아래 JSON 형식으로만 답변해라.\n"
        '{"summary":"한 문장 또는 두 문장 요약","keywords":["키워드1","키워드2","키워드3"]}\n'
        "summary는 자연스러운 한국어로 작성하고, keywords는 중복 없는 짧은 핵심어 3개로 제한해라."
    )


# 전처리
def _preprocess_text(text: str) -> str:
    cleaned_text = re.sub(r"<[^>]+>", " ", text or "")
    cleaned_text = re.sub(r"[\r\n\t]+", " ", cleaned_text)
    cleaned_text = re.sub(r"\s+", " ", cleaned_text).strip()
    return cleaned_text[:MAX_INPUT_CHARS]


# 응답 문자열에서 JSON 데이터를 깨내서 Python dict로 변환
def _extract_json_block(content: str) -> dict | None:
    if not content:
        return None

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        pass

    match = re.search(r"\{.*\}", content, re.DOTALL)
    if not match:
        return None

    try:
        return json.loads(match.group(0))
    except json.JSONDecodeError:
        return None


# OpenAI에 요청보내고, 결과 정리해서 반환
async def _generate_summary(cleaned_text: str) -> dict[str, object]:
    if not cleaned_text:
        raise HTTPException(status_code=400, detail="Review text is empty.")

    content = await chat_completion_content(
        prompt=f"리뷰 원문:\n{cleaned_text}",
        system_prompt=_summary_prompt(),
    )

    parsed = _extract_json_block(content)
    if not parsed:
        raise HTTPException(status_code=502, detail="AI service returned an invalid summary payload.")

    summary = str(parsed.get("summary", "")).strip()
    keywords = parsed.get("keywords", [])

    if not summary:
        raise HTTPException(status_code=502, detail="AI service returned an empty summary.")

    if not isinstance(keywords, list):
        keywords = []

    normalized_keywords = []
    for keyword in keywords:
        keyword_text = str(keyword).strip()
        if keyword_text and keyword_text not in normalized_keywords:
            normalized_keywords.append(keyword_text)

    return {
        "summary": summary,
        "keywords": normalized_keywords[:3],
    }

# 라우터에서 호출하는 함수
async def analyze_summarize_logic(allText):
    cleaned_text = _preprocess_text(allText)
    return await _generate_summary(cleaned_text)
