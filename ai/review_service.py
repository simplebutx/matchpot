import re
from typing import Iterable


# 문장 정리 함수
def preprocess_text(text: str) -> str:
    if not text:
        return ""

    normalized = text.strip()  # 양쪽 끝 공백 제거
    normalized = re.sub(r"\s+", " ", normalized)  # 연속 공백, 줄바꿈, 탭을 한 칸 공백으로 정리
    normalized = re.sub(r"([~!@#$%^&*(),.?/<>;:'])\1+", r"\1", normalized)  # 반복된 특수문자를 하나로 축약
    normalized = re.sub(r"([ㅋㅎㅠㅜㅇㄷ])\1+", r"\1", normalized)  # 반복된 의미 없는 문자를 하나로 축약
    return normalized


# 리뷰 전처리
def preprocess_reviews(reviews: Iterable[dict]) -> list[dict]:  # for in (순회하기 쉽게) 쓰기 위해 Iterable 사용
    processed_reviews = []

    for review in reviews:
        processed_review = dict(review)  # 수정을 위한 복사
        processed_review["content"] = preprocess_text(review.get("content", "")) 
        processed_reviews.append(processed_review)

    return processed_reviews
