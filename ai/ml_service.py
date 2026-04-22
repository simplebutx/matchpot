from collections import defaultdict
from typing import Iterable

import torch  # 파이토치 모델을 만들고 실행하는 딥러닝 엔진
from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline
# pipeline: HuggingFace가 만든 "모델 사용을 쉽게 해주는 묶음 도구"

from preprocessing_service import preprocess_reviews

# 감정 분류 모델 (긍정, 중립, 부정)
SENTIMENT_MODEL_NAME = "cardiffnlp/twitter-xlm-roberta-base-sentiment"
# 모델 출력 라벨을 서비스용 이름으로 변환
SENTIMENT_LABELS = {
    "LABEL_0": "negative",
    "LABEL_1": "neutral",
    "LABEL_2": "positive",
}

_sentiment_analyzer = None


# 감정분석 파이프라인을 준비해서 가져오는 함수
def get_sentiment_analyzer():
    global _sentiment_analyzer  # global: 함수 안에서 바깥쪽 전역 변수를 수정
    if _sentiment_analyzer is None:
        # 최초 1번만 모델/토크나이저 로드
        tokenizer = AutoTokenizer.from_pretrained(SENTIMENT_MODEL_NAME)  # 토크나이저: 문장을 모델이 이해할 수 있는 입력형태로 바꿔주는 도구
        model = AutoModelForSequenceClassification.from_pretrained(SENTIMENT_MODEL_NAME)
        device = 0 if torch.cuda.is_available() else -1  # cuda: 엔비디아 GPU를 이용해 연산을 빠르게 처리해주는 기술
        # gpu가 있으면 gpu로 돌리고 없으면 cpu로 돌림
        _sentiment_analyzer = pipeline(  # 토큰화, 모델추론, 점수계산, 결과정리
            "sentiment-analysis",
            model=model,
            tokenizer=tokenizer,
            device=device,
            top_k=None,
        )

    return _sentiment_analyzer


# 감정분석 파이프라인을 실행하는 함수
def analyze_sentiment_reviews(reviews: Iterable[dict]) -> dict:
    processed_reviews = preprocess_reviews(reviews)  # 리뷰 전처리
    analyzer = get_sentiment_analyzer()  # 분석기 가져오기
    contents = [review.get("content", "") for review in processed_reviews]  # content만 꺼내기
    if not contents:
        return {}

    predictions = analyzer(contents)  # !! 파이프라인 실행 (각 리뷰가 긍정/중립/부정 중 어느 감정인지 예측)
    event_scores = defaultdict(float)
    event_id = None

    for review, prediction in zip(processed_reviews, predictions):  # zip: ("리뷰1", "예측1"), ("리뷰2", "예측2") 이런식으로 묶어줌
        # 각 감정별 점수 -> 딕셔너리 형태로 변환
        # ex) {"negative": 0.12, "neutral": 0.18, "positive": 0.7}
        label_scores = {
            SENTIMENT_LABELS.get(item["label"], item["label"]): round(float(item["score"]), 4)
            for item in prediction
        }

        # 가장 높은 점수의 감정 선택
        top_result = max(prediction, key=lambda item: item["score"])
        top_label = SENTIMENT_LABELS.get(top_result["label"], top_result["label"])

        analyzed_review = dict(review)  # 원래 리뷰 데이터 복사
        analyzed_review["sentiment"] = top_label  # 리뷰의 최종 감정 추가
        analyzed_review["score"] = round(float(top_result["score"]), 4)  # 최종 감정의 최고 점수 추가
        analyzed_review["scores"] = label_scores  # 전체 감정 점수 추가

        event_id = analyzed_review.get("eventId")
        for label, score in analyzed_review["scores"].items():
            event_scores[label] += score  # 이벤트 단위 대표 감정을 위해 리뷰 점수 누적

    final_sentiment = max(event_scores, key=event_scores.get)

    return {
        "eventId": event_id,
        "sentiment": final_sentiment,
    }
