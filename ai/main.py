import os
import sys
from typing import List

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from fastapi import FastAPI
from pydantic import BaseModel, Field

from recommend.recommend import run_recommendation_logic
from sentiment.ml_service import analyze_sentiment_reviews
from summarize.summarize import analyze_summarize_logic

app = FastAPI()


class ReviewRequest(BaseModel):
    eventId: int
    reviewId: int
    content: str


class ReviewAnalyzeResponse(BaseModel):
    data: dict


class AiSummarizeRequest(BaseModel):
    eventId: int
    allText: str = Field(default="")


class AiSummarizeResponse(BaseModel):
    eventId: int
    summary: str
    keywords: List[str]
    improvement: str


class RecommendRequest(BaseModel):
    userHistory: str
    allEvents: List[dict]


@app.post("/internal/reviews/analyze", response_model=ReviewAnalyzeResponse)
async def analyze_reviews(reviews: List[ReviewRequest]):
    analyzed_event = analyze_sentiment_reviews([review.model_dump() for review in reviews])
    return {"data": analyzed_event}


@app.post("/analyze", response_model=AiSummarizeResponse)
async def analyze_summarize(data: AiSummarizeRequest):
    result = await analyze_summarize_logic(data.allText)

    return AiSummarizeResponse(
        eventId=data.eventId,
        summary=result["summary"],
        keywords=result["keywords"],
        improvement=result["improvement"],
    )


@app.post("/recommend")
async def get_recommendations(data: RecommendRequest):
    return run_recommendation_logic(data.userHistory, data.allEvents)
