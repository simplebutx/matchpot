import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from sentiment.ml_service import analyze_sentiment_reviews
from summarize.summarize import analyze_summarize_logic
from recommend.recommend import run_recommendation_logic

app = FastAPI()

class ReviewRequest(BaseModel):
    eventId: int
    reviewId: int
    content: str

@app.post("/internal/reviews/analyze")
async def analyze_reviews(reviews: List[ReviewRequest]):
    analyzed_event = analyze_sentiment_reviews([review.model_dump() for review in reviews])
    return {"data": analyzed_event}


#ai 리뷰 한줄평
class AiRequest(BaseModel):
    eventId: int
    allText: str
    
@app.post("/analyze")
async def analyze_summarize(data: AiRequest):
    # summarize.py에 있는 로직 함수를 실행!
    result = analyze_summarize_logic(data.allText)
    
    return {
        "eventId": data.eventId,
        "summary": result["summary"],
        "keywords": result["keywords"]
    }

#ai 추천기능
class RecommendRequest(BaseModel):
    userHistory: str
    allEvents: List[dict]
    
@app.post("/recommend")
async def get_recommendations(data: RecommendRequest):
    result = run_recommendation_logic(data.userHistory, data.allEvents)
    return result