from collections import defaultdict
from typing import Iterable

import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline

from sentiment.preprocessing_service import preprocess_reviews

SENTIMENT_MODEL_NAME = "cardiffnlp/twitter-xlm-roberta-base-sentiment"
SENTIMENT_LABELS = {
    "LABEL_0": "negative",
    "LABEL_1": "neutral",
    "LABEL_2": "positive",
}

_sentiment_analyzer = None


def get_sentiment_analyzer():
    global _sentiment_analyzer
    if _sentiment_analyzer is None:
        tokenizer = AutoTokenizer.from_pretrained(SENTIMENT_MODEL_NAME)
        model = AutoModelForSequenceClassification.from_pretrained(SENTIMENT_MODEL_NAME)
        device = 0 if torch.cuda.is_available() else -1
        _sentiment_analyzer = pipeline(
            "sentiment-analysis",
            model=model,
            tokenizer=tokenizer,
            device=device,
            top_k=None,
        )

    return _sentiment_analyzer


def analyze_sentiment_reviews(reviews: Iterable[dict]) -> dict:
    processed_reviews = preprocess_reviews(reviews)
    analyzer = get_sentiment_analyzer()
    contents = [review.get("content", "") for review in processed_reviews]
    if not contents:
        return {}

    predictions = analyzer(contents)
    event_scores = defaultdict(float)
    sentiment_counts = defaultdict(int)
    event_id = None

    for review, prediction in zip(processed_reviews, predictions):
        label_scores = {
            SENTIMENT_LABELS.get(item["label"], item["label"]): round(float(item["score"]), 4)
            for item in prediction
        }

        top_result = max(prediction, key=lambda item: item["score"])
        top_label = SENTIMENT_LABELS.get(top_result["label"], top_result["label"])
        sentiment_counts[top_label] += 1

        analyzed_review = dict(review)
        analyzed_review["sentiment"] = top_label
        analyzed_review["score"] = round(float(top_result["score"]), 4)
        analyzed_review["scores"] = label_scores

        event_id = analyzed_review.get("eventId")
        for label, score in analyzed_review["scores"].items():
            event_scores[label] += score

    final_sentiment = max(event_scores, key=event_scores.get)
    total_reviews = len(processed_reviews)

    sentiment_percentages = {}
    for label in ("positive", "neutral", "negative"):
        ratio = (sentiment_counts[label] / total_reviews) * 100 if total_reviews else 0
        sentiment_percentages[label] = round(ratio, 1)

    return {
        "eventId": event_id,
        "sentiment": final_sentiment,
        "sentimentPercentages": sentiment_percentages,
    }
