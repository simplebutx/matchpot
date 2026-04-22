import re
from typing import Iterable


# 문장 정리 함수
def preprocess_text(text: str) -> str:
    if not text:
        return ""

    normalized = text.strip()  # 양쪽 공백 제거
    normalized = re.sub(r"\s+", " ", normalized)  # 연속 공백 정리
    normalized = re.sub(r"([~!@#$%^&*(),.?/<>;:'])\1+", r"\1", normalized)  # 반복 특수문자 축약
    return normalized


# 리뷰 전처리
def preprocess_reviews(reviews: Iterable[dict]) -> list[dict]:
    processed_reviews = []

    for review in reviews:
        processed_review = dict(review)  # 수정용 복사본
        processed_review["content"] = preprocess_text(review.get("content", ""))
        processed_reviews.append(processed_review)

    return processed_reviews
